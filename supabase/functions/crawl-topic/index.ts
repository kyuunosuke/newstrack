import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];

  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);

  for (const match of itemMatches) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const link = extractTag(itemXml, "link") || extractAttr(itemXml, "link", "href");
    const description = extractTag(itemXml, "description");
    const pubDate = extractTag(itemXml, "pubDate");
    const sourceName = extractAttr(itemXml, "source", "url") 
      ? extractTag(itemXml, "source") 
      : extractDomain(link);

    if (title && link) {
      items.push({
        title: stripHtml(title),
        link,
        description: stripHtml(description || ""),
        pubDate: pubDate || new Date().toISOString(),
        source: sourceName || extractDomain(link),
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const cdataMatch = xml.match(
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`)
  );
  if (cdataMatch) return cdataMatch[1].trim();

  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
  if (match) return match[1].trim();

  return "";
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"[^>]*>`));
  return match ? match[1] : "";
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "News";
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugToSourceName(url: string): string {
  const domain = extractDomain(url);
  const knownSources: Record<string, string> = {
    "reuters.com": "Reuters",
    "bbc.com": "BBC News",
    "bbc.co.uk": "BBC News",
    "nytimes.com": "The New York Times",
    "theguardian.com": "The Guardian",
    "washingtonpost.com": "Washington Post",
    "apnews.com": "Associated Press",
    "bloomberg.com": "Bloomberg",
    "ft.com": "Financial Times",
    "wsj.com": "Wall Street Journal",
    "cnn.com": "CNN",
    "foxnews.com": "Fox News",
    "nbcnews.com": "NBC News",
    "abcnews.go.com": "ABC News",
    "cbsnews.com": "CBS News",
    "npr.org": "NPR",
    "techcrunch.com": "TechCrunch",
    "wired.com": "Wired",
    "theverge.com": "The Verge",
    "arstechnica.com": "Ars Technica",
    "nature.com": "Nature",
    "science.org": "Science",
    "aljazeera.com": "Al Jazeera",
    "forbes.com": "Forbes",
    "time.com": "Time",
    "newsweek.com": "Newsweek",
  };
  return knownSources[domain] || domain;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders, status: 200 });
  }

  try {
    const { topic_id, topic_title } = await req.json();

    if (!topic_id || !topic_title) {
      return new Response(
        JSON.stringify({ error: "topic_id and topic_title are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const query = encodeURIComponent(topic_title);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NewsBot/1.0)",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch RSS: ${response.status}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const xml = await response.text();
    const items = parseRSS(xml).slice(0, 15);

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ message: "No articles found", inserted: 0 }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const entries = items.map((item) => {
      const sourceName = slugToSourceName(item.link);
      const excerpt = item.description.length > 300
        ? item.description.slice(0, 297) + "..."
        : item.description || item.title;

      let publishedAt: string;
      try {
        publishedAt = new Date(item.pubDate).toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }

      return {
        topic_id,
        headline: item.title,
        excerpt: excerpt || item.title,
        full_excerpt: item.description || null,
        source_name: sourceName,
        source_logo_url: null,
        source_url: item.link,
        author: null,
        is_verified: false,
        tags: [],
        published_at: publishedAt,
      };
    });

    const { error: insertError } = await supabase
      .from("timeline_entries")
      .insert(entries);

    if (insertError) {
      return new Response(
        JSON.stringify({ error: `Failed to insert entries: ${insertError.message}` }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    await supabase
      .from("topics")
      .update({
        total_sources: entries.length,
        last_updated: new Date().toISOString(),
      })
      .eq("id", topic_id);

    return new Response(
      JSON.stringify({
        message: `Successfully crawled and inserted ${entries.length} articles`,
        inserted: entries.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

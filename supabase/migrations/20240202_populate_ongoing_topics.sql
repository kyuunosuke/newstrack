DELETE FROM timeline_entries;
DELETE FROM topics;

INSERT INTO topics (title, summary, slug, total_sources, last_updated) VALUES
(
  'Israel-Gaza Conflict',
  'Ongoing military conflict between Israel and Hamas in Gaza, with international diplomatic efforts and humanitarian concerns continuing to develop.',
  'israel-gaza-conflict',
  12,
  NOW() - INTERVAL '2 hours'
),
(
  'Ukraine War Updates',
  'Continuing coverage of the Russia-Ukraine war, including military developments, international support, and peace negotiations.',
  'ukraine-war-updates',
  15,
  NOW() - INTERVAL '1 hour'
),
(
  'Climate Crisis 2024',
  'Ongoing climate change developments including extreme weather events, policy changes, and international climate action efforts.',
  'climate-crisis-2024',
  10,
  NOW() - INTERVAL '3 hours'
),
(
  'AI Regulation Debate',
  'Evolving discussions and policy developments around artificial intelligence regulation in the US, EU, and globally.',
  'ai-regulation-debate',
  8,
  NOW() - INTERVAL '5 hours'
),
(
  'US Presidential Election 2024',
  'Comprehensive coverage of the 2024 US presidential race, primaries, debates, and campaign developments.',
  'us-presidential-election-2024',
  14,
  NOW() - INTERVAL '30 minutes'
),
(
  'Boeing Safety Investigation',
  'Ongoing investigation into Boeing aircraft safety concerns following multiple incidents and regulatory scrutiny.',
  'boeing-safety-investigation',
  9,
  NOW() - INTERVAL '4 hours'
),
(
  'Tech Layoffs 2024',
  'Continuing coverage of layoffs across the technology sector and their impact on the industry.',
  'tech-layoffs-2024',
  11,
  NOW() - INTERVAL '6 hours'
),
(
  'China-Taiwan Tensions',
  'Developing situation regarding cross-strait relations, military activities, and international diplomatic responses.',
  'china-taiwan-tensions',
  10,
  NOW() - INTERVAL '2 hours'
),
(
  'Global Inflation Crisis',
  'Ongoing economic developments related to inflation, interest rates, and central bank policies worldwide.',
  'global-inflation-crisis',
  13,
  NOW() - INTERVAL '1 hour'
),
(
  'OpenAI Leadership Saga',
  'Continuing developments at OpenAI including governance changes, safety debates, and product launches.',
  'openai-leadership-saga',
  7,
  NOW() - INTERVAL '8 hours'
);

INSERT INTO timeline_entries (topic_id, headline, excerpt, source_name, source_logo_url, source_url, is_verified, author, published_at, tags) VALUES

((SELECT id FROM topics WHERE slug = 'israel-gaza-conflict'), 'UN Security Council Debates Gaza Ceasefire Resolution', 'The United Nations Security Council convened for emergency discussions on a proposed ceasefire resolution, with member states sharply divided on the path forward. Diplomatic sources indicate intensive behind-the-scenes negotiations as civilian casualties continue to mount.', 'BBC News', 'https://logo.clearbit.com/bbc.com', 'https://www.bbc.com', true, 'James Landale', NOW() - INTERVAL '2 hours', ARRAY['diplomacy', 'UN', 'ceasefire']),

((SELECT id FROM topics WHERE slug = 'israel-gaza-conflict'), 'Humanitarian Aid Convoys Enter Southern Gaza', 'International aid organizations report that several convoys carrying food, water, and medical supplies have entered southern Gaza through the Rafah crossing. However, aid workers warn that the assistance remains insufficient given the scale of need.', 'Reuters', 'https://logo.clearbit.com/reuters.com', 'https://www.reuters.com', true, 'Nidal al-Mughrabi', NOW() - INTERVAL '5 hours', ARRAY['humanitarian', 'aid', 'Gaza']),

((SELECT id FROM topics WHERE slug = 'israel-gaza-conflict'), 'IDF Reports Tunnel Network Discovery', 'Israeli Defense Forces announced the discovery of an extensive tunnel network in northern Gaza, claiming it was used for military operations. Military officials state the operation to neutralize these tunnels will continue for several weeks.', 'Times of Israel', 'https://logo.clearbit.com/timesofisrael.com', 'https://www.timesofisrael.com', true, 'Emanuel Fabian', NOW() - INTERVAL '8 hours', ARRAY['military', 'tunnels', 'IDF']),

((SELECT id FROM topics WHERE slug = 'ukraine-war-updates'), 'Ukraine Receives New Air Defense Systems', 'NATO allies delivered advanced air defense systems to Ukraine as part of a new military aid package. Ukrainian officials expressed gratitude while emphasizing the ongoing need for additional support to counter Russian air attacks.', 'The Guardian', 'https://logo.clearbit.com/theguardian.com', 'https://www.theguardian.com', true, 'Dan Sabbagh', NOW() - INTERVAL '1 hour', ARRAY['military', 'NATO', 'defense']),

((SELECT id FROM topics WHERE slug = 'ukraine-war-updates'), 'Diplomatic Push for Peace Talks Intensifies', 'Several European leaders are coordinating efforts to restart peace negotiations between Ukraine and Russia. Sources indicate preliminary discussions are underway, though significant obstacles remain regarding territorial disputes.', 'Financial Times', 'https://logo.clearbit.com/ft.com', 'https://www.ft.com', true, 'Max Seddon', NOW() - INTERVAL '4 hours', ARRAY['diplomacy', 'peace', 'negotiations']),

((SELECT id FROM topics WHERE slug = 'ukraine-war-updates'), 'Russian Forces Advance in Eastern Donbas', 'Military analysts report Russian forces have made incremental gains in the Donbas region despite fierce Ukrainian resistance. Both sides report heavy casualties in the ongoing fighting near strategic locations.', 'AP News', 'https://logo.clearbit.com/apnews.com', 'https://www.apnews.com', true, 'Hanna Arhirova', NOW() - INTERVAL '3 hours', ARRAY['military', 'Donbas', 'combat']),

((SELECT id FROM topics WHERE slug = 'climate-crisis-2024'), 'Antarctic Ice Shelf Shows Alarming Melting Rate', 'New satellite data reveals that a major Antarctic ice shelf is melting at twice the rate previously estimated. Scientists warn this could accelerate sea level rise and urge immediate action on emissions reduction.', 'Nature', 'https://logo.clearbit.com/nature.com', 'https://www.nature.com', true, 'Dr. Sarah Johnson', NOW() - INTERVAL '3 hours', ARRAY['Antarctica', 'ice', 'research']),

((SELECT id FROM topics WHERE slug = 'climate-crisis-2024'), 'EU Approves Landmark Carbon Border Tax', 'The European Union finalized implementation details for its carbon border adjustment mechanism, which will impose tariffs on imports from countries with weaker climate policies. The move is expected to significantly impact global trade.', 'Bloomberg', 'https://logo.clearbit.com/bloomberg.com', 'https://www.bloomberg.com', true, 'Ewa Krukowska', NOW() - INTERVAL '6 hours', ARRAY['policy', 'EU', 'carbon']),

((SELECT id FROM topics WHERE slug = 'climate-crisis-2024'), 'Extreme Heatwave Hits South Asia', 'Temperatures exceeding 45°C (113°F) are affecting millions across India and Pakistan, forcing school closures and straining power grids. Climate scientists link the intensity to human-caused global warming.', 'Al Jazeera', 'https://logo.clearbit.com/aljazeera.com', 'https://www.aljazeera.com', true, 'Asad Hashim', NOW() - INTERVAL '12 hours', ARRAY['weather', 'heatwave', 'Asia']),

((SELECT id FROM topics WHERE slug = 'ai-regulation-debate'), 'EU AI Act Enters Final Implementation Phase', 'European regulators published detailed guidelines for implementing the AI Act, setting global precedents for AI governance. Tech companies now face compliance deadlines for high-risk AI systems.', 'TechCrunch', 'https://logo.clearbit.com/techcrunch.com', 'https://www.techcrunch.com', true, 'Natasha Lomas', NOW() - INTERVAL '5 hours', ARRAY['regulation', 'EU', 'policy']),

((SELECT id FROM topics WHERE slug = 'ai-regulation-debate'), 'US Congress Debates AI Safety Framework', 'Bipartisan AI safety legislation gained momentum in Congress with new co-sponsors from both parties. The bill would establish federal oversight for powerful AI systems and require safety testing.', 'Politico', 'https://logo.clearbit.com/politico.com', 'https://www.politico.com', true, 'Emily Birnbaum', NOW() - INTERVAL '8 hours', ARRAY['legislation', 'US', 'safety']),

((SELECT id FROM topics WHERE slug = 'us-presidential-election-2024'), 'Iowa Caucus Results Show Tight Race', 'Early results from the Iowa caucuses indicate a closely contested race among top candidates. Voter turnout exceeded expectations despite severe winter weather across the state.', 'CNN', 'https://logo.clearbit.com/cnn.com', 'https://www.cnn.com', true, 'Jeff Zeleny', NOW() - INTERVAL '30 minutes', ARRAY['election', 'Iowa', 'caucus']),

((SELECT id FROM topics WHERE slug = 'us-presidential-election-2024'), 'Campaign Finance Reports Reveal Major Donors', 'New FEC filings show unprecedented fundraising by several campaigns, with tech industry donors playing a prominent role. Analysis reveals shifting donor coalitions compared to previous election cycles.', 'New York Times', 'https://logo.clearbit.com/nytimes.com', 'https://www.nytimes.com', true, 'Shane Goldmacher', NOW() - INTERVAL '4 hours', ARRAY['fundraising', 'finance', 'donors']),

((SELECT id FROM topics WHERE slug = 'us-presidential-election-2024'), 'Presidential Debate Schedule Confirmed', 'The Commission on Presidential Debates announced official dates and formats for general election debates. Campaigns are already strategizing on preparation and messaging for the high-stakes events.', 'Washington Post', 'https://logo.clearbit.com/washingtonpost.com', 'https://www.washingtonpost.com', true, 'Michael Scherer', NOW() - INTERVAL '7 hours', ARRAY['debate', 'schedule', 'campaign']),

((SELECT id FROM topics WHERE slug = 'boeing-safety-investigation'), 'FAA Orders Expanded 737 MAX Inspections', 'Federal aviation regulators mandated additional safety checks on Boeing 737 MAX aircraft following recent incidents. Airlines must complete the inspections within 30 days or ground affected planes.', 'Aviation Week', 'https://logo.clearbit.com/aviationweek.com', 'https://www.aviationweek.com', true, 'Sean Broderick', NOW() - INTERVAL '4 hours', ARRAY['FAA', 'safety', '737MAX']),

((SELECT id FROM topics WHERE slug = 'boeing-safety-investigation'), 'Boeing Announces Leadership Changes', 'Boeing''s board announced management changes in its commercial aircraft division as part of efforts to address quality and safety concerns. The moves come amid intense regulatory scrutiny.', 'Wall Street Journal', 'https://logo.clearbit.com/wsj.com', 'https://www.wsj.com', true, 'Andrew Tangel', NOW() - INTERVAL '9 hours', ARRAY['management', 'leadership', 'corporate']),

((SELECT id FROM topics WHERE slug = 'tech-layoffs-2024'), 'Meta Announces Additional Workforce Reduction', 'Meta disclosed plans to cut 5,000 positions across multiple divisions as part of ongoing efficiency improvements. The layoffs affect engineering, product, and business teams globally.', 'The Verge', 'https://logo.clearbit.com/theverge.com', 'https://www.theverge.com', true, 'Alex Heath', NOW() - INTERVAL '6 hours', ARRAY['layoffs', 'Meta', 'tech']),

((SELECT id FROM topics WHERE slug = 'tech-layoffs-2024'), 'Tech Employment Trends Show Mixed Signals', 'Despite high-profile layoffs, data shows tech hiring remains strong in AI and cloud computing sectors. Industry analysts describe a shift rather than a collapse in tech employment.', 'MIT Technology Review', 'https://logo.clearbit.com/technologyreview.com', 'https://www.technologyreview.com', true, 'Will Douglas Heaven', NOW() - INTERVAL '10 hours', ARRAY['employment', 'trends', 'analysis']),

((SELECT id FROM topics WHERE slug = 'china-taiwan-tensions'), 'Taiwan Reports Increased Military Activity', 'Taiwan''s defense ministry detected multiple Chinese military aircraft and naval vessels near its territory in the largest show of force this month. Officials called the actions destabilizing.', 'South China Morning Post', 'https://logo.clearbit.com/scmp.com', 'https://www.scmp.com', true, 'Kristin Huang', NOW() - INTERVAL '2 hours', ARRAY['military', 'Taiwan', 'China']),

((SELECT id FROM topics WHERE slug = 'china-taiwan-tensions'), 'US Reaffirms Taiwan Security Commitment', 'The US State Department reiterated its commitment to Taiwan''s defense following recent Chinese military exercises. The statement emphasized maintaining peace and stability in the Taiwan Strait.', 'Voice of America', 'https://logo.clearbit.com/voanews.com', 'https://www.voanews.com', true, 'Nike Ching', NOW() - INTERVAL '5 hours', ARRAY['diplomacy', 'US', 'security']),

((SELECT id FROM topics WHERE slug = 'global-inflation-crisis'), 'Federal Reserve Holds Interest Rates Steady', 'The US Federal Reserve maintained current interest rates while signaling potential cuts later this year if inflation continues to moderate. Markets reacted positively to the measured approach.', 'CNBC', 'https://logo.clearbit.com/cnbc.com', 'https://www.cnbc.com', true, 'Jeff Cox', NOW() - INTERVAL '1 hour', ARRAY['Fed', 'rates', 'economy']),

((SELECT id FROM topics WHERE slug = 'global-inflation-crisis'), 'European Central Bank Faces Diverging Pressures', 'ECB officials debate policy direction as inflation remains above target in some member states while others show signs of economic weakness. The challenge of coordinating monetary policy grows.', 'Financial Times', 'https://logo.clearbit.com/ft.com', 'https://www.ft.com', true, 'Martin Arnold', NOW() - INTERVAL '3 hours', ARRAY['ECB', 'Europe', 'monetary']),

((SELECT id FROM topics WHERE slug = 'openai-leadership-saga'), 'OpenAI Announces New Board Members', 'OpenAI revealed additions to its board of directors aimed at strengthening governance and safety oversight. The appointments follow months of organizational restructuring.', 'The Information', 'https://logo.clearbit.com/theinformation.com', 'https://www.theinformation.com', true, 'Amir Efrati', NOW() - INTERVAL '8 hours', ARRAY['governance', 'board', 'OpenAI']),

((SELECT id FROM topics WHERE slug = 'openai-leadership-saga'), 'GPT-5 Development Timeline Revealed', 'Sources familiar with OpenAI''s roadmap indicate GPT-5 training is progressing with enhanced safety protocols. The company plans extensive testing before any public release.', 'Semafor', 'https://logo.clearbit.com/semafor.com', 'https://www.semafor.com', false, 'Reed Albergotti', NOW() - INTERVAL '12 hours', ARRAY['AI', 'GPT-5', 'development']);

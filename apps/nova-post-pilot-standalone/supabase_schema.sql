-- Content Profiles
CREATE TABLE content_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  description TEXT,
  platforms TEXT[] NOT NULL,
  posting_frequency TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Posts
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES content_profiles(id),
  title TEXT NOT NULL,
  caption TEXT NOT NULL,
  platform TEXT NOT NULL,
  media_url TEXT,
  hashtags TEXT[],
  scheduled_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending',
  published_at TIMESTAMPTZ,
  error_message TEXT,
  analytics JSONB,
  ai_suggestion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hook Suggestions
CREATE TABLE hook_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES content_profiles(id),
  hook_text TEXT NOT NULL,
  variant TEXT,
  platform TEXT,
  is_favorite BOOLEAN DEFAULT false,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_profiles_user ON content_profiles(user_id);
CREATE INDEX idx_scheduled_posts_user ON scheduled_posts(user_id);
CREATE INDEX idx_scheduled_posts_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_hook_suggestions_profile ON hook_suggestions(profile_id);

-- RLS Policies
ALTER TABLE content_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hook_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profiles" ON content_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profiles" ON content_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profiles" ON content_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own posts" ON scheduled_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON scheduled_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON scheduled_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own hooks" ON hook_suggestions FOR SELECT USING (EXISTS (SELECT 1 FROM content_profiles WHERE id = profile_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own hooks" ON hook_suggestions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM content_profiles WHERE id = profile_id AND user_id = auth.uid()));

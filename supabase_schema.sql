-- Pixel Learning System Schema
-- Append to existing Supabase schema

-- Pixel Profiles Table
CREATE TABLE IF NOT EXISTS pixel_profiles (
  user_id UUID PRIMARY KEY,
  pixel_preferences JSONB NOT NULL DEFAULT '[]',
  avg_color TEXT NOT NULL DEFAULT '#00FFE7',
  avg_speed FLOAT NOT NULL DEFAULT 1.0,
  total_interactions BIGINT NOT NULL DEFAULT 0,
  last_update TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pixel Behavior Data Table
CREATE TABLE IF NOT EXISTS pixel_behavior (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  behavior_data JSONB NOT NULL DEFAULT '{}',
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Pixel ML Models Table
CREATE TABLE IF NOT EXISTS pixel_ml_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model_data JSONB NOT NULL DEFAULT '{}',
  model_accuracy FLOAT NOT NULL DEFAULT 0.0,
  training_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pixel_profiles_user_id ON pixel_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_pixel_profiles_last_update ON pixel_profiles(last_update);

CREATE INDEX IF NOT EXISTS idx_pixel_behavior_user_id ON pixel_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_pixel_behavior_session_id ON pixel_behavior(session_id);
CREATE INDEX IF NOT EXISTS idx_pixel_behavior_created_at ON pixel_behavior(created_at);

CREATE INDEX IF NOT EXISTS idx_pixel_ml_models_user_id ON pixel_ml_models(user_id);
CREATE INDEX IF NOT EXISTS idx_pixel_ml_models_is_active ON pixel_ml_models(is_active);
CREATE INDEX IF NOT EXISTS idx_pixel_ml_models_created_at ON pixel_ml_models(created_at);

-- Row Level Security (RLS)
ALTER TABLE pixel_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_behavior ENABLE ROW LEVEL SECURITY;
ALTER TABLE pixel_ml_models ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pixel_profiles
CREATE POLICY "Users can view their own pixel profiles" ON pixel_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pixel profiles" ON pixel_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pixel profiles" ON pixel_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for pixel_behavior
CREATE POLICY "Users can view their own behavior data" ON pixel_behavior
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own behavior data" ON pixel_behavior
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own behavior data" ON pixel_behavior
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for pixel_ml_models
CREATE POLICY "Users can view their own ML models" ON pixel_ml_models
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ML models" ON pixel_ml_models
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ML models" ON pixel_ml_models
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_pixel_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_pixel_behavior_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_pixel_ml_models_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updates
CREATE TRIGGER trigger_update_pixel_profiles_updated_at
  BEFORE UPDATE ON pixel_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_pixel_profiles_updated_at();

CREATE TRIGGER trigger_update_pixel_behavior_updated_at
  BEFORE UPDATE ON pixel_behavior
  FOR EACH ROW
  EXECUTE FUNCTION update_pixel_behavior_updated_at();

CREATE TRIGGER trigger_update_pixel_ml_models_updated_at
  BEFORE UPDATE ON pixel_ml_models
  FOR EACH ROW
  EXECUTE FUNCTION update_pixel_ml_models_updated_at();

-- Cleanup function for old data
CREATE OR REPLACE FUNCTION cleanup_old_pixel_data()
RETURNS void AS $$
BEGIN
  -- Delete behavior data older than 30 days
  DELETE FROM pixel_behavior 
  WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Delete inactive ML models older than 90 days
  DELETE FROM pixel_ml_models 
  WHERE is_active = false 
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
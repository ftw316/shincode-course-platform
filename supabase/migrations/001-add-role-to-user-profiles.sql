-- Add role column to user_profiles table
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user';

-- Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- Add constraint to ensure valid roles
ALTER TABLE user_profiles 
ADD CONSTRAINT check_valid_role 
CHECK (role IN ('user', 'admin', 'moderator'));

-- Insert sample admin user (replace with actual user_id after Google login)
-- This is just a placeholder - you'll need to update with real user_id
-- UPDATE user_profiles SET role = 'admin' WHERE user_id = 'your-actual-google-user-id';
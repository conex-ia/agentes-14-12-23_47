import { createClient } from '@supabase/supabase-js';
import { validateEnv, getEnvVar } from '../utils/env';

// Validate all required environment variables on startup
validateEnv();

// Create Supabase client with validated credentials
export const supabase = createClient(
  getEnvVar('SUPABASE_URL'),
  getEnvVar('SUPABASE_KEY')
);
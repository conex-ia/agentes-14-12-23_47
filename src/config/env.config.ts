/**
 * Environment variable configuration and validation
 */
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY
} as const;

export type EnvKey = keyof typeof ENV;
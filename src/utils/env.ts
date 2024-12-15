import { ENV, type EnvKey } from '../config/env.config';

/**
 * Validates that all required environment variables are set
 * @throws Error if any required variables are missing
 */
export function validateEnv(): void {
  const missingVars = Object.entries(ENV)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(createEnvErrorMessage(missingVars));
  }
}

/**
 * Gets a validated environment variable
 * @param key The environment variable key
 * @returns The environment variable value
 * @throws Error if the variable is not set
 */
export function getEnvVar(key: EnvKey): string {
  const value = ENV[key];
  
  if (!value) {
    throw new Error(createEnvErrorMessage([key]));
  }

  return value;
}

/**
 * Creates a formatted error message for missing environment variables
 */
function createEnvErrorMessage(missingVars: string[]): string {
  return [
    'Missing required environment variables:',
    missingVars.map(v => `  - ${v}`).join('\n'),
    '\nPlease follow these steps to fix:',
    '1. Create a .env file by copying .env.example:',
    '   cp .env.example .env',
    '2. Open .env and fill in your Supabase credentials',
    '3. Restart the development server',
    '\nNote: Never commit your .env file to version control!'
  ].join('\n');
}
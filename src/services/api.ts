/**
 * Base API configuration and utilities
 */
import { handleError } from '../utils/errors';

export async function handleApiResponse<T>(
  promise: Promise<{ data: T | null; error: any }>,
  context: string
): Promise<T[]> {
  try {
    const { data, error } = await promise;
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err) {
    handleError(err, context);
    return [];
  }
}
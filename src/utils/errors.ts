/**
 * Creates a standardized error message
 */
export function createErrorMessage(context: string, details?: string): string {
  const message = `Erro ao ${context.toLowerCase()}`;
  return details ? `${message}: ${details}` : message;
}

/**
 * Handles and logs errors consistently
 */
export function handleError(error: unknown, context: string): string {
  const errorMessage = createErrorMessage(context);
  console.error(`${errorMessage}:`, error);
  return errorMessage;
}
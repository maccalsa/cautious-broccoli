export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number,
  delayMs: number = 0,
  onRetry?: (error: any, attempt: number) => void,
  shouldRetry?: (error: any) => boolean,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await operation();
    } catch (error) {
      attempt++;
      if (shouldRetry && !shouldRetry(error)) {
        throw error;
      }
      if (attempt > maxRetries) {
        throw error;
      }
      if (onRetry) {
        onRetry(error, attempt);
      }
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}

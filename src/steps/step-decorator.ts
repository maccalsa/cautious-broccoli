import { ExecutionContext } from "@/execution-context";
import { RetryPolicy, Step } from "@/interfaces/interfaces";
import { RetryMetrics } from "@/retry/retry-policies";
import { withRetry } from "@/retry/with-retry";

export function withStepRetryDecorator(
  step: Step,
  retryPolicy: RetryPolicy,
  metrics: RetryMetrics = new RetryMetrics(),
): Step {
  return {
    async execute(context: ExecutionContext) {
      await withRetry(
        () => step.execute(context),
        retryPolicy.maxRetries,
        retryPolicy.delayMs || 0,
        (error, attempt) => {
          console.warn(`Step retry attempt ${attempt}: ${error}`);
          metrics.increment("stepRetries");
        },
        retryPolicy.shouldRetry,
      );
      console.log("Step executed successfully (with retry if needed).");
      console.log("Step Retry Metrics:", metrics.getAll());
    },
  };
}

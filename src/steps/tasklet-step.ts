import { ExecutionContext } from "@/execution-context";
import {
  RepeatStatus,
  RetryPolicy,
  Step,
  Tasklet,
} from "@/interfaces/interfaces";
import { withRetry } from "@/retry/with-retry";

export class TaskletStep implements Step {
  private tasklet: Tasklet;
  private retryPolicy?: RetryPolicy;

  constructor(tasklet: Tasklet, retryPolicy?: RetryPolicy) {
    this.tasklet = tasklet;
    this.retryPolicy = retryPolicy;
  }

  public async execute(context: ExecutionContext): Promise<void> {
    console.log("Executing TaskletStep with retry mechanism...");
    let status: RepeatStatus;
    do {
      status = await withRetry(
        () => this.tasklet.execute(context),
        this.retryPolicy?.maxRetries || 0,
        this.retryPolicy?.delayMs || 0,
        (error, attempt) => {
          console.warn(`Attempt ${attempt} failed with error: ${error}`);
        },
        this.retryPolicy?.shouldRetry,
      );
    } while (status === RepeatStatus.CONTINUABLE);
    console.log("TaskletStep complete.");
  }
}

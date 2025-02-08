import { ExecutionContext } from "@/execution-context";
import { Job } from "@/job";

export class JobExecutor {
  // A basic job executor that supports asynchronous execution of multiple jobs.
  private jobs: { job: Job; context: ExecutionContext }[] = [];

  public addJob(job: Job, context: ExecutionContext = new ExecutionContext()) {
    this.jobs.push({ job, context });
  }

  // Execute all jobs concurrently
  public async executeAll(): Promise<void> {
    const executions = this.jobs.map(({ job, context }) =>
      job.execute(context),
    );
    await Promise.all(executions);
    console.log("All jobs executed.");
  }

  // Execute jobs sequentially
  public async executeSequentially(): Promise<void> {
    for (const { job, context } of this.jobs) {
      await job.execute(context);
    }
    console.log("All jobs executed sequentially.");
  }
}

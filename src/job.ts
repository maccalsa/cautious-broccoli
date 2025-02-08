import { ExecutionContext } from "./execution-context";
import { Step } from "./interfaces/interfaces";

export class Job {
  private steps: Step[] = [];

  constructor(private name: string) {
    this.name = name;
  }

  public addStep(step: Step): void {
    this.steps.push(step);
  }

  public async execute(
    context: ExecutionContext = new ExecutionContext(),
  ): Promise<void> {
    console.log(`Starting Job: ${this.name}`);
    for (const step of this.steps) {
      await step.execute(context);
    }
    console.log(`Job: ${this.name} completed.`);
  }
}

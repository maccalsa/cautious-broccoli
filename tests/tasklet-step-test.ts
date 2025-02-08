import { TaskletStep } from "../src/steps/tasklet-step";
import { Tasklet, RepeatStatus } from "../src/interfaces/interfaces";
import { ExecutionContext } from "../src/execution-context";

describe("TaskletStep", () => {
  it("should execute tasklet until FINISHED", async () => {
    // Arrange
    let executionCount = 0;
    const mockTasklet: Tasklet = {
      execute: async () => {
        executionCount++;
        return executionCount < 3
          ? RepeatStatus.CONTINUABLE
          : RepeatStatus.FINISHED;
      },
    };

    const taskletStep = new TaskletStep(mockTasklet);

    // Act
    await taskletStep.execute(new ExecutionContext());

    // Assert
    expect(executionCount).toBe(3);
  });

  it("should handle retry policy", async () => {
    // Arrange
    let attempts = 0;
    const mockTasklet: Tasklet = {
      execute: async () => {
        attempts++;
        if (attempts < 3) {
          throw new Error("Temporary failure");
        }
        return RepeatStatus.FINISHED;
      },
    };

    const retryPolicy = {
      maxRetries: 3,
      delayMs: 100,
      shouldRetry: (error: any) => error.message === "Temporary failure",
    };

    const taskletStep = new TaskletStep(mockTasklet, retryPolicy);

    // Act
    await taskletStep.execute(new ExecutionContext());

    // Assert
    expect(attempts).toBe(3);
  });
});

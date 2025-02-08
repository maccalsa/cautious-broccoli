import { expect } from "chai";
import { Job } from "@/job";
import { ExecutionContext } from "@/execution-context";
import { Step } from "@/interfaces/interfaces";

describe("Job", () => {
  it("should execute all steps in order", async () => {
    // Arrange
    const executionOrder: number[] = [];
    const job = new Job("TestJob");

    const mockStep1: Step = {
      execute: async () => {
        executionOrder.push(1);
      },
    };

    const mockStep2: Step = {
      execute: async () => {
        executionOrder.push(2);
      },
    };

    // Act
    job.addStep(mockStep1);
    job.addStep(mockStep2);
    await job.execute();

    // Assert
    expect(executionOrder).to.deep.equal([1, 2]);
  });

  it("should pass context between steps", async () => {
    // Arrange
    const job = new Job("ContextTestJob");
    const context = new ExecutionContext();

    const mockStep1: Step = {
      execute: async (ctx) => {
        ctx.set("testKey", "testValue");
      },
    };

    const mockStep2: Step = {
      execute: async (ctx) => {
        expect(ctx.get("testKey")).to.equal("testValue");
      },
    };

    // Act & Assert
    job.addStep(mockStep1);
    job.addStep(mockStep2);
    await job.execute(context);
  });
});

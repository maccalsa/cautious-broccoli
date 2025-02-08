import { RetryableChunkStep } from "../src/steps/retryable-chunk-step";
import {
  ItemReader,
  ItemProcessor,
  ItemWriter,
} from "../src/interfaces/interfaces";
import { ExecutionContext } from "../src/execution-context";
import { ChunkRetryPolicies } from "../src/retry/retry-policies";

describe("RetryableChunkStep", () => {
  it("should retry failed reads", async () => {
    // Arrange
    let readAttempts = 0;
    const mockReader: ItemReader<number> = {
      read: async () => {
        readAttempts++;
        if (readAttempts < 3) {
          throw new Error("Read failed");
        }
        return null;
      },
    };

    const mockProcessor: ItemProcessor<number, number> = {
      process: async (item) => item,
    };

    const mockWriter: ItemWriter<number> = {
      write: async () => {},
    };

    const retryPolicies: ChunkRetryPolicies = {
      readerRetryPolicy: {
        maxRetries: 3,
        delayMs: 100,
      },
    };

    const step = new RetryableChunkStep(
      mockReader,
      mockProcessor,
      mockWriter,
      10,
      retryPolicies,
    );

    // Act
    await step.execute(new ExecutionContext());

    // Assert
    expect(readAttempts).toBe(3);
  });

  it("should retry failed writes", async () => {
    // Arrange
    let writeAttempts = 0;
    const items = [1, 2, 3];
    let currentIndex = 0;

    const mockReader: ItemReader<number> = {
      read: async () => {
        if (currentIndex < items.length) {
          return items[currentIndex++];
        }
        return null;
      },
    };

    const mockProcessor: ItemProcessor<number, number> = {
      process: async (item) => item,
    };

    const mockWriter: ItemWriter<number> = {
      write: async () => {
        writeAttempts++;
        if (writeAttempts < 3) {
          throw new Error("Write failed");
        }
      },
    };

    const retryPolicies: ChunkRetryPolicies = {
      writerRetryPolicy: {
        maxRetries: 3,
        delayMs: 100,
      },
    };

    const step = new RetryableChunkStep(
      mockReader,
      mockProcessor,
      mockWriter,
      10,
      retryPolicies,
    );

    // Act
    await step.execute(new ExecutionContext());

    // Assert
    expect(writeAttempts).toBe(3);
  });
});

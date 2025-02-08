import { expect } from "chai";
import { ChunkStep } from "@/steps/chunk-step";
import { ItemReader, ItemProcessor, ItemWriter } from "@/interfaces/interfaces";
import { ExecutionContext } from "@/execution-context";

describe("ChunkStep", () => {
  it("should process items in chunks", async () => {
    // Arrange
    const items = [1, 2, 3, 4, 5];
    let currentIndex = 0;
    const writtenChunks: number[][] = [];

    const mockReader: ItemReader<number> = {
      read: async () => {
        if (currentIndex < items.length) {
          return items[currentIndex++];
        }
        return null;
      },
    };

    const mockProcessor: ItemProcessor<number, number> = {
      process: async (item) => item * 2,
    };

    const mockWriter: ItemWriter<number> = {
      write: async (chunk) => {
        writtenChunks.push([...chunk]);
      },
    };

    const chunkStep = new ChunkStep(mockReader, mockProcessor, mockWriter, 2);

    // Act
    await chunkStep.execute(new ExecutionContext());

    // Assert
    expect(writtenChunks).to.deep.equal([[2, 4], [6, 8], [10]]);
  });
});

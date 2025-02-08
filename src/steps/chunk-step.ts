import { ExecutionContext } from "@/execution-context";
import {
  ItemProcessor,
  ItemReader,
  ItemWriter,
  Step,
} from "@/interfaces/interfaces";

export class ChunkStep<I, O> implements Step {
  private reader: ItemReader<I>;
  private processor: ItemProcessor<I, O>;
  private writer: ItemWriter<O>;
  private chunkSize: number;

  constructor(
    reader: ItemReader<I>,
    processor: ItemProcessor<I, O>,
    writer: ItemWriter<O>,
    chunkSize: number = 10,
  ) {
    this.reader = reader;
    this.processor = processor;
    this.writer = writer;
    this.chunkSize = chunkSize;
  }

  public async execute(context: ExecutionContext): Promise<void> {
    console.log("Starting ChunkStep...");
    let chunk: O[] = [];
    while (true) {
      const item = await this.reader.read();
      if (item === null) {
        if (chunk.length > 0) {
          await this.writer.write(chunk);
        }
        break;
      }
      const processed = await this.processor.process(item);
      if (processed !== null) {
        chunk.push(processed);
      }
      if (chunk.length >= this.chunkSize) {
        await this.writer.write(chunk);
        chunk = [];
      }
    }
    console.log("ChunkStep complete.");
  }
}

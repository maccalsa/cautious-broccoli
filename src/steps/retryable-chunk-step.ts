import { ExecutionContext } from "@/execution-context";
import {
  ItemProcessor,
  ItemReader,
  ItemWriter,
  Step,
} from "@/interfaces/interfaces";
import { ChunkRetryPolicies } from "@/retry/retry-policies";
import { withRetry } from "@/retry/with-retry";

export class RetryableChunkStep<I, O> implements Step {
  constructor(
    private reader: ItemReader<I>,
    private processor: ItemProcessor<I, O>,
    private writer: ItemWriter<O>,
    private chunkSize: number = 10,
    private retryPolicies: ChunkRetryPolicies,
  ) {}

  public async execute(context: ExecutionContext): Promise<void> {
    console.log("Starting RetryableChunkStep...");
    let chunk: O[] = [];

    while (true) {
      const item = await this.readWithRetry();
      if (item === null) {
        if (chunk.length > 0) {
          await this.writeWithRetry(chunk);
        }
        break;
      }

      const processed = await this.processWithRetry(item);
      if (processed !== null) {
        chunk.push(processed);
      }

      if (chunk.length >= this.chunkSize) {
        await this.writeWithRetry(chunk);
        chunk = [];
      }
    }
    console.log("RetryableChunkStep complete.");
  }

  private async readWithRetry(): Promise<I | null> {
    return withRetry(
      () => this.reader.read(),
      this.retryPolicies.readerRetryPolicy?.maxRetries || 0,
      this.retryPolicies.readerRetryPolicy?.delayMs || 0,
      undefined,
      this.retryPolicies.readerRetryPolicy?.shouldRetry,
    );
  }

  private async processWithRetry(item: I): Promise<O | null> {
    return withRetry(
      () => this.processor.process(item),
      this.retryPolicies.processorRetryPolicy?.maxRetries || 0,
      this.retryPolicies.processorRetryPolicy?.delayMs || 0,
      undefined,
      this.retryPolicies.processorRetryPolicy?.shouldRetry,
    );
  }

  private async writeWithRetry(items: O[]): Promise<void> {
    return withRetry(
      () => this.writer.write(items),
      this.retryPolicies.writerRetryPolicy?.maxRetries || 0,
      this.retryPolicies.writerRetryPolicy?.delayMs || 0,
      undefined,
      this.retryPolicies.writerRetryPolicy?.shouldRetry,
    );
  }
}

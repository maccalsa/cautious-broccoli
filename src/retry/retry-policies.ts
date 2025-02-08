import { RetryPolicy } from "@/interfaces/interfaces";

export interface ChunkRetryPolicies {
  readerRetryPolicy?: RetryPolicy;
  processorRetryPolicy?: RetryPolicy;
  writerRetryPolicy?: RetryPolicy;
}

export class RetryMetrics {
  private metrics: { [key: string]: number } = {};

  public increment(key: string) {
    this.metrics[key] = (this.metrics[key] || 0) + 1;
  }

  public getMetric(key: string): number {
    return this.metrics[key] || 0;
  }

  public getAll(): { [key: string]: number } {
    return { ...this.metrics };
  }
}

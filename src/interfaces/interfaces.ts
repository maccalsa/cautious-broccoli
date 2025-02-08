import { ExecutionContext } from "@/execution-context";

export interface Step {
  execute(context: ExecutionContext): Promise<void>;
}

export enum RepeatStatus {
  FINISHED,
  CONTINUABLE,
}

export interface Tasklet {
  execute(context: ExecutionContext): Promise<RepeatStatus>;
}

export interface RetryPolicy {
  maxRetries: number;
  delayMs?: number;
  shouldRetry?: (error: any) => boolean;
}

export interface ItemReader<T> {
  read(): Promise<T | null>;
}

export interface ItemProcessor<I, O> {
  process(item: I): Promise<O | null>;
}

export interface ItemWriter<T> {
  write(items: T[]): Promise<void>;
}

export interface ItemStream<T> {
  read(): Promise<T | null>;
  process(item: T): Promise<T | null>;
  write(items: T[]): Promise<void>;
}

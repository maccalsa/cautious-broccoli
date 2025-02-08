
# Cautious Broccoli

![CI](https://github.com/maccalsa/cautious-broccoli/actions/workflows/ci.yml/badge.svg)

![Version](https://img.shields.io/github/package-json/v/maccalsa/cautious-broccoli)

Cautious Broccoli is a lightweight, TypeScript-based batch processing framework inspired by Spring Batch. It provides a robust foundation for building batch applications with features like chunk processing, retry mechanisms, and modular job execution.

![Cautious Broccoli Logo](./img/cautious-broccoli-logo.png)

## Features

- **Job Management**: Organize batch processes into jobs with multiple steps
- **Flexible Step Types**: Support for both tasklet-based and chunk-oriented processing
- **Retry Mechanisms**: Built-in retry policies for handling transient failures
- **Chunk Processing**: Efficient processing of large datasets in chunks
- **Type Safety**: Full TypeScript support with generics for type-safe batch processing
- **Extensible Architecture**: Easy to extend and customize for specific needs


## Core Concepts

### Job

A Job is the main unit of work in TSBatch. It contains one or more Steps that are executed sequentially.

```typescript
const job = new Job("MyJob");
job.addStep(step1);
job.addStep(step2);
await job.execute();
```

### Steps

TSBatch supports two types of steps:

1. **TaskletStep**: For simple, single-operation tasks
2. **ChunkStep**: For processing data in chunks (read-process-write pattern)

#### TaskletStep

```typescript
class MyTasklet implements Tasklet {
  async execute(context: ExecutionContext): Promise<RepeatStatus> {
    // Do something
    return RepeatStatus.FINISHED;
  }
}

const taskletStep = new TaskletStep(new MyTasklet());
```

#### ChunkStep

```typescript
const chunkStep = new ChunkStep<InputType, OutputType>(
  reader,    // implements ItemReader<InputType>
  processor, // implements ItemProcessor<InputType, OutputType>
  writer,    // implements ItemWriter<OutputType>
  chunkSize  // number
);
```

### Retry Policies

TSBatch provides robust retry mechanisms for handling transient failures:

```typescript
const retryPolicy: RetryPolicy = {
  maxRetries: 3,
  delayMs: 500,
  shouldRetry: (error) => error.message.includes("Transient")
};
```

## API Reference

### Core Interfaces

#### Step
```typescript
interface Step {
  execute(context: ExecutionContext): Promise<void>;
}
```

#### Tasklet
```typescript
interface Tasklet {
  execute(context: ExecutionContext): Promise<RepeatStatus>;
}
```

#### ItemReader
```typescript
interface ItemReader<T> {
  read(): Promise<T | null>;
}
```

#### ItemProcessor
```typescript
interface ItemProcessor<I, O> {
  process(item: I): Promise<O | null>;
}
```

#### ItemWriter
```typescript
interface ItemWriter<T> {
  write(items: T[]): Promise<void>;
}
```

### Retry Mechanisms

#### RetryPolicy
```typescript
interface RetryPolicy {
  maxRetries: number;
  delayMs?: number;
  shouldRetry?: (error: any) => boolean;
}
```

#### ChunkRetryPolicies
```typescript
interface ChunkRetryPolicies {
  readerRetryPolicy?: RetryPolicy;
  processorRetryPolicy?: RetryPolicy;
  writerRetryPolicy?: RetryPolicy;
}
```

## Usage Examples

### Basic Job with Tasklet

```typescript
// Create a simple tasklet
class PrintTasklet implements Tasklet {
  constructor(private message: string) {}
  
  async execute(context: ExecutionContext): Promise<RepeatStatus> {
    console.log(this.message);
    return RepeatStatus.FINISHED;
  }
}

// Create and run a job
const job = new Job("SimpleJob");
job.addStep(new TaskletStep(new PrintTasklet("Hello, World!")));
await job.execute();
```

### Chunk Processing with Retry

```typescript
// Define retry policies
const chunkRetryPolicies: ChunkRetryPolicies = {
  readerRetryPolicy: { maxRetries: 3, delayMs: 1000 },
  processorRetryPolicy: { maxRetries: 2, delayMs: 500 },
  writerRetryPolicy: { maxRetries: 3, delayMs: 1000 }
};

// Create a retryable chunk step
const retryableChunkStep = new RetryableChunkStep(
  new DataReader(),
  new DataProcessor(),
  new DataWriter(),
  10, // chunk size
  chunkRetryPolicies
);

// Create and run the job
const job = new Job("ChunkJob");
job.addStep(retryableChunkStep);
await job.execute();
```

## Best Practices

1. **Error Handling**: Always implement proper error handling in your readers, processors, and writers.
2. **Chunk Size**: Choose appropriate chunk sizes based on your data and memory constraints.
3. **Retry Policies**: Configure retry policies based on the nature of potential failures.
4. **Context Usage**: Use ExecutionContext to share data between steps when necessary.
5. **Type Safety**: Leverage TypeScript's type system to ensure type safety throughout your batch process.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

This project is created by [@maccals](https://github.com/maccalsa).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Commit Message

This project uses commitlint to enforce commit message conventions.
the commit message should be in the following format:

```
<type>(<scope>): <subject>
```

with the following types:

- feat: A new feature
- fix: A bug fix
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- build: Changes that affect the build system or external dependencies
- ops: Changes to the CI configuration files and scripts
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- merge: Merge branch 'pr-branch' into 'main'

and the scope should be the name of the package affected by the changes.


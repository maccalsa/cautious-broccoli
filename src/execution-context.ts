export class ExecutionContext {
  private context: { [key: string]: any } = {};

  public get(key: string): any {
    return this.context[key];
  }

  public set(key: string, value: any): void {
    this.context[key] = value;
  }

  public has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.context, key);
  }
}

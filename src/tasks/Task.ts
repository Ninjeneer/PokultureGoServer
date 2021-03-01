export default abstract class Task {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract task(): Promise<any>;
  abstract canRun(): Promise<boolean>;

  public run(): Promise<any> {
    return new Promise((resolve, error) => {
      try {
        console.log(`\nRunning [${this.getName()}]...`);
        const start = Date.now();
        this.task().then((r) => {
          const stop = Date.now();
          console.log(`Task [${this.getName()}] finished successfully (${stop - start}ms)`);
          resolve(r)
        }).catch((e) => error(e));
      } catch (e) {
        console.log(`/!\\ Task [${this.getName()}] failed for reason :`);
        console.log(e);
      }
    });
  }

  public getName() {
    return this.name;
  }
}

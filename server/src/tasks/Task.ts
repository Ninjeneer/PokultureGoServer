export default abstract class Task {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract task(): Promise<any>;

  public run(): Promise<any> {
    return new Promise((resolve, error) => {
      try {
        this.task().then((r) => resolve(r)).catch((e) => error(e));
      } catch (e) {
        error(e);
      }
    });
  }

  public getName() {
    return this.name;
  }
}

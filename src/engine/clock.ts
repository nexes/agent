export class Clock {
  private simulationTimeStep: number;
  private delta: number;
  private previousTime: number;
  private runningTime: number;
  private running: boolean;

  constructor(simulationTimeStep?: number) {
    this.simulationTimeStep = simulationTimeStep ||  1000 / 60;
    this.delta = 0;
    this.previousTime = 0;
    this.runningTime = 0;
    this.running = false;
  }

  public start() {
    if (this.running) {
      return;
    }

    this.previousTime = performance.now();
    this.runningTime = 0;
    this.running = true;
  }

  public stop() {
    this.delta = 0;
    this.previousTime = 0;
    this.running = false;
  }

  public get deltaTime(): number {
    const rightNow = performance.now();

    this.delta = rightNow - this.previousTime;
    this.previousTime = rightNow;
    this.runningTime += this.delta;

    return this.delta;
  }

  public get elapsedTime(): number {
    const _ = this.deltaTime;
    return this.runningTime;
  }

  public get physicsTimeStep(): number {
    return this.simulationTimeStep;
  }
}

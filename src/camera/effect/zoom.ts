import { IEffect } from '../effect';
import { Math, Vector2, TransformationMatrix } from '../../math';


export class ZoomEffect implements IEffect {
  private isAnimating: boolean;
  private duration: number;
  private timeAccumulated: number;
  private transform: TransformationMatrix;
  private scale: Vector2;
  private currentScale: Vector2;
  private completeCallback: () => void;

  constructor(scale: Vector2 | number, duration: number, transform: TransformationMatrix) {
    this.isAnimating = false;
    this.duration = duration;
    this.transform = transform;
    this.timeAccumulated = 0;
    this.completeCallback = null;
    this.currentScale = transform.scaled;
    console.log('current scale ', this.currentScale);

    if (scale instanceof Vector2) {
      this.scale = scale;

    } else {
      this.scale = new Vector2(scale, scale);
    }
  }

  public start(): Promise<void> {
    this.isAnimating = true;

    return new Promise<void>((resolve) => {
      this.completeCallback = resolve;
    });
  }

  public update(dt: number): void {
    if (this.isAnimating) {
      if (this.timeAccumulated >= this.duration) {
        console.log('zoom is done updating');
        this.isAnimating = false;
        this.scale = null;
        this.transform = null;
        this.duration = 0;
        this.timeAccumulated = 0;

        this.completeCallback();
        return;
      }

      this.timeAccumulated += dt;
      const lerpTime = Math.smoothStep(this.timeAccumulated / this.duration);

      this.currentScale = Math.lerpVec2(this.currentScale, this.scale, lerpTime);
      this.transform.scale(this.currentScale);
    }
  }

  public get animating(): boolean {
    return this.isAnimating;
  }
}

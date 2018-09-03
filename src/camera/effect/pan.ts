import { IEffect } from '../effect';
import { Math, Vector2, TransformationMatrix } from '../../math';


export class PanEffect implements IEffect {
  private isAnimating: boolean;
  private currentPos: Vector2;
  private endPos: Vector2;
  private timeAccumulated: number;
  private duration: number;
  private transform: TransformationMatrix;
  private completeCallback: () => void;

  constructor(endPosition: Vector2, duration: number, transform: TransformationMatrix) {
    this.isAnimating = false;
    this.transform = transform;
    this.currentPos = transform.position;
    this.endPos = this.currentPos.add(endPosition);
    this.timeAccumulated = 0;
    this.duration = duration;
    this.completeCallback = null;
  }

  public start(): Promise<void> {
    this.isAnimating = true;

    return new Promise<void>((resolve) => {
      this.completeCallback = resolve;
    });
  }

  public update(dt: number): void {
    if (this.isAnimating === true) {
      if (this.timeAccumulated >= this.duration) {
        this.isAnimating = false;
        this.endPos = null;
        this.timeAccumulated = 0;
        this.duration = 0;

        this.completeCallback();
        return;
      }

      this.timeAccumulated += dt;
      const lerpTime = Math.smoothStep(this.timeAccumulated / this.duration);

      this.currentPos = Math.lerpVec2(this.currentPos, this.endPos, lerpTime);
      this.transform.translate(this.currentPos);
    }
  }

  public  get animating(): boolean {
    return this.isAnimating;
  }
}


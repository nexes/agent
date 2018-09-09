import { Math, Vector2, TransformationMatrix } from '../../math';
import { IEffect } from '../effect';


export class ShakeEffect implements IEffect {
  private isAnimating: boolean;
  private duration: number;
  private timeAccumulated: number;
  private octave: number;
  private damping: number;
  private originalPos: Vector2;
  private offset: Vector2;
  private transform: TransformationMatrix;
  private completeCallback: () => void;

  constructor(duration: number, octave: number, damping: number, transform: TransformationMatrix) {
    this.isAnimating = false;
    this.duration = duration;
    this.octave = octave;
    this.damping = damping;
    this.timeAccumulated = 0;
    this.transform = transform;
    this.originalPos = null;
    this.completeCallback = null;
    this.offset = new Vector2(0, 0);

  }

  public start(): Promise<void> {
    this.isAnimating = true;
    this.originalPos = this.transform.position;
    this.offset.x = (Math.random() * 2) + this.originalPos.x;
    this.offset.y = (Math.random() * 2) + this.originalPos.y;

    return new Promise<void>((resolve) => {
      this.completeCallback = resolve;
    });
  }

  public update(dt: number): void {
    if (this.isAnimating) {
      if (this.timeAccumulated >= this.duration) {
        this.transform.translate(this.originalPos);
        this.transform.rotate(0);

        this.isAnimating = false;
        this.originalPos = null;
        this.transform = null;
        this.timeAccumulated = 0;
        this.duration = 0;

        this.completeCallback();
        return;
      }

      this.timeAccumulated += dt;

      const noise = Math.perlinNoise2d(this.offset.x, this.offset.y, this.octave, this.damping);
      this.offset.y += noise * (this.octave * this.damping);
      this.offset.x += noise;

      this.transform.translate(this.offset);
      this.transform.rotate(Math.toRadian(noise));
    }
  }

  public get animating(): boolean {
    return this.isAnimating;
  }
}

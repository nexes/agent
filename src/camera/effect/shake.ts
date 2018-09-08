import { Math, Vector2, TransformationMatrix } from '../../math';
import { IEffect } from '../effect';


export class ShakeEffect implements IEffect {
  private isAnimating: boolean;
  private duration: number;
  private timeAccumulated: number;
  private octave: number;
  private damping: number;
  private originalPos: Vector2;
  private transform: TransformationMatrix;
  private completeCallback: () => void;

  private play: number;

  constructor(duration: number, octave: number, damping: number, transform: TransformationMatrix) {
    this.isAnimating = false;
    this.duration = duration;
    this.octave = octave;
    this.damping = damping;
    this.timeAccumulated = 0;
    this.transform = transform;
    this.originalPos = null;
    this.completeCallback = null;

    this.play = 1;
  }

  public start(): Promise<void> {
    this.isAnimating = true;
    this.originalPos = this.transform.position;

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

      const pos = this.transform.position;
      const noise = Math.perlinNoise2d(pos.x + 0.01, pos.y + 0.01, this.octave, this.damping);
      const noiseVec = Math.lerpVec2(pos, new Vector2(pos.x + noise, pos.y + noise), dt);
      // because this accumulates with +, we can get our camera to move to much

      this.play *= noise;
      console.log('noise: ', noise);
      this.transform.translate(noiseVec);
      this.transform.rotate(Math.smoothStep(this.play));
    }
  }

  public get animating(): boolean {
    return this.isAnimating;
  }
}

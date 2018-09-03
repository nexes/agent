import { PanEffect, IEffect } from './effect';
import { Vector2, TransformationMatrix } from '../math';


export class CameraEffects {
  private runningEffects: IEffect[];
  private cameraTransform: TransformationMatrix;

  constructor(transform: TransformationMatrix) {
    this.runningEffects = new Array();
    this.cameraTransform = transform;
  }

  public fadeIn(): void {
    // TODO
  }

  public fadeOut(): void {
    // TODO
  }

  public shake(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // TODO
    });
  }

  public pan(position: Vector2, duration: number, force: boolean = false): Promise<void> {
    if (this.runningEffects.length > 0 && !force) {
      return Promise.reject(new Error('there is an animation currently in progress'));
    }

    const pan = new PanEffect(position, duration, this.cameraTransform);
    this.runningEffects.push(pan);

    return pan.start();
  }

  public zoom(): void {
    // TODO
  }

  /**
   * @param {number} dt what do you wnat
   */
  public update(dt: number): void {
    if (this.runningEffects.length > 0) {
      const originalLen = this.runningEffects.length;

      for (let i = 0; i < originalLen; i++) {
        const effect = this.runningEffects.pop();
        effect.update(dt);

        // if the effect isn't done, lets put it back
        if (effect.animating) {
          this.runningEffects.push(effect);
        }
      }
    }
  }

  public get animating(): boolean {
    return this.runningEffects.length !== 0;
  }
}

import { PanEffect, ZoomEffect, ShakeEffect, IEffect } from './effect';
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

  public shake(duration: number, octave: number = 4, damping: number = 0.5, force: boolean = false): Promise<void> {
    if (this.runningEffects.length > 0 && !force) {
      return Promise.reject(new Error('there is an animation currently in progress'));
    }

    const shake = new ShakeEffect(duration, octave, damping, this.cameraTransform);
    this.runningEffects.push(shake);

    return shake.start();
  }

  public pan(position: Vector2, duration: number, force: boolean = false): Promise<void> {
    if (this.runningEffects.length > 0 && !force) {
      return Promise.reject(new Error('there is an animation currently in progress'));
    }

    const pan = new PanEffect(position, duration, this.cameraTransform);
    this.runningEffects.push(pan);

    return pan.start();
  }

  public zoom(scale: Vector2 | number, duration: number, force: boolean = false): Promise<void> {
    if (this.runningEffects.length > 0 && !force) {
      return Promise.reject(new Error('there is an animation currently in progress'));
    }

    const zoom = new ZoomEffect(scale, duration, this.cameraTransform);
    this.runningEffects.push(zoom);

    return zoom.start();
  }

  public update(dt: number): void {
    if (this.runningEffects.length > 0) {
      const originalLen = this.runningEffects.length;

      for (let i = 0; i < originalLen; i++) {
        const effect = this.runningEffects.shift();
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

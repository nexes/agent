export { PanEffect } from './pan';
export { ZoomEffect } from './zoom';

export interface IEffect {
  /**
   * @property indicate if this effect is currently animating.
   * @readonly
   */
  readonly animating: boolean;

  /**
   * update the camera effect over the given amount of time
   * @param {number} dt the change in time in milliseconds.
   */
  update(dt: number): void;

  /**
   * begin the animation for the given effect.
   * @returns {Promise<void>} the promise will resolve when the animation is finished
   */
  start(): Promise<void>;
}


import { UUID } from '../agent';
import { Clock } from '../engine';
import { IRect } from '../math';


export class Sprite {
  public readonly UUID: string;

  private clock: Clock;
  private accumaltedTime: number;
  private frameTotal: number;
  private framesPerSec: number;
  private currentFrame: number;
  private width: number;
  private height: number;
  private xOffset: number;
  private yOffset: number;

  /**
   * Create a new Sprite sheet. This should be called through the Spritesheet class generateSprite()
   * @param {number} xOffset the X offset for the first sprite tile location
   * @param {number} yOffset the Y offset for the first sprite tile location
   * @param {number} frames the number of frames this sprite has
   * @param {number} animation speed to show the next frame, frames per second REWORD THIS
   * @param {number} width  the width of the frame divied by the width of the spritesheet img file e.g 64/1024
   * @param {number} height  the height of the frame divied by the height of the spritesheet img file e.g 64/1024
   */
  constructor(xOffset: number, yOffset: number, frames: number, animation: number, width: number, height: number) {
    this.UUID = UUID();
    this.clock = new Clock(1000 / frames);
    this.accumaltedTime = 0;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.frameTotal = frames;
    this.framesPerSec = 1000 / animation;
    this.currentFrame = 0;
    this.width = width;
    this.height = height;

    this.clock.start();
  }

  /**
   * Get the position and width and height of a single sprite frame. Frames are index starting at 0, frame 0, fraem 1 etc
   * @param {number}  frameIndex the frame index of the sprite
   * @returns {IRect} the rect of the requested frame. If index is out of bounds will return frame at index 0
   */
  public getFrameAtIndex(frameIndex: number): IRect {
    if (frameIndex > this.frameTotal || frameIndex < 0) {
      // TODO: dispatch errors
      console.log(`getPositionForFrame: frameIndex out of bounds, resetting to frame 0. Frame given: ${frameIndex}`);
      frameIndex = 0;
    }

    return {
      x: this.xOffset + (this.width * frameIndex),
      y: this.yOffset, // what if y is on a different row
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Get the next frame if it's time to receive the new frame, this will loop
   * @returns {IRect} the rect of the next frame.
   */
  public getNextFrame(): IRect {
    this.accumaltedTime += this.clock.deltaTime;

    while (this.accumaltedTime >= this.framesPerSec) {
      this.currentFrame = this.currentFrame + 1 < this.frameTotal ? this.currentFrame + 1 : 0;
      this.accumaltedTime -= this.framesPerSec;
    }

    return this.getFrameAtIndex(this.currentFrame);
  }
}

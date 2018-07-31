import { UUID } from '../agent';
import { IRect } from '../math';


export class Sprite {
  public readonly UUID: string;

  private frames: number;
  private width: number;
  private height: number;
  private xOffset: number;
  private yOffset: number;

  /**
   * Create a new Sprite sheet. This should be called through the Spritesheet class generateSprite()
   * @param {number} xOffset the X offset for the first sprite tile location
   * @param {number} yOffset the Y offset for the first sprite tile location
   * @param {number} frames the number of frames this sprite has
   * @param {number} width  the width of the frame divied by the width of the spritesheet img file e.g 64/1024
   * @param {number} height  the height of the frame divied by the height of the spritesheet img file e.g 64/1024
   */
  constructor(xOffset: number, yOffset: number, frames: number, width: number, height: number) {
    this.UUID = UUID();
    this.xOffset = xOffset;
    this.yOffset = yOffset;
    this.frames = frames;
    this.width = width;
    this.height = height;
  }

  /**
   * Get the position and width and height of a single sprite frame. Frames are index starting at 0, frame 0, fraem 1 etc
   * @param {number}  frameIndex the frame index of the sprite
   * @returns {IRect} the rect of the requested frame. Undefined if index is out of bounds
   */
  public getPositionForFrame(frameIndex: number): IRect | undefined {
    if (frameIndex > this.frames || frameIndex < 0) {
      // TODO: or just use a nextFrame();
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
}

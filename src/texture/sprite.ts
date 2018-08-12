import { UUID } from '../agent';
import { Clock } from '../engine';
import { IRect } from '../math';
import { ISpriteTile } from '../texture';


export class Sprite {
  public readonly UUID: string;

  private spriteTile: ISpriteTile;
  private clock: Clock;
  private accumaltedTime: number;
  private frameTotal: number;
  private framesPerSec: number;
  private currentFrame: number;

  /**
   * Create a new Sprite sheet. This should be called through the Spritesheet class generateSprite()
   * @param {number}  frames  the number of frames this sprite will have
   * @param {number} animation the number of frames to show per animation step
   * @param {ISpriteTile} tileRect the geometry of the tile in the sprite, (all tiles are the same size).
   * The X and Y are the offsets where the first tile is located in the spritesheet. If row and/or column are ommited, it will
   * be assumed that the sprite tiles are linear, 1 row frames long
   */
  constructor(frames: number, animation: number, tileRect: ISpriteTile) {
    this.UUID = UUID();
    // we don't need to set a custom clock speed, we just care about delta times
    this.clock = new Clock();
    this.spriteTile = tileRect;
    this.frameTotal = frames;
    this.accumaltedTime = 0;
    this.framesPerSec = 1000 / animation;
    this.currentFrame = 0;

    if (!this.spriteTile.row || !this.spriteTile.column) {
      this.spriteTile.row = 1;
      this.spriteTile.column = this.frameTotal;
    }

    this.clock.start();
  }

  /**
   * Get the position and width and height of a single sprite frame. Frames are index starting at 0
   * @param {number}  frameIndex the frame index of the sprite
   * @returns {IRect} the rect of the requested frame. If index is out of bounds will return frame at index 0
   */
  public getFrameAtIndex(frameIndex: number): IRect {
    if (frameIndex >= this.frameTotal || frameIndex < 0) {
      // TODO: dispatch errors
      console.log(`getPositionForFrame: frameIndex out of bounds, resetting to frame 0. Frame given: ${frameIndex}`);
      frameIndex = 0;
    }

    return {
      x: this.spriteTile.x + (this.spriteTile.width * (Math.floor(frameIndex % this.spriteTile.column))),
      y: this.spriteTile.y + (this.spriteTile.height * (Math.floor(frameIndex / this.spriteTile.column))),
      width: this.spriteTile.width,
      height: this.spriteTile.height,
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

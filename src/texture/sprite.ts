import { UUID } from '../agent';


export class Sprite {
  public readonly UUID: string;

  private frames: number;
  private startX: number;
  private startY: number;
  private width: number;
  private height: number;

  constructor(frames: number, xoffset: number, yoffset: number, width: number, height: number) {
    this.UUID = UUID();
    this.frames = frames;
    this.startX = xoffset;
    this.startY = yoffset;
    this.width = width;
    this.height = height;
  }
}
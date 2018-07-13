import { UUID } from '../agent';


export class Sprite {
  public readonly UUID: string;

  private frames: number;
  private startIndex: number;
  private width: number;
  private height: number;

  constructor(startIndex: number, frames: number, width: number, height: number) {
    this.UUID = UUID();
    this.frames = frames;
    this.startIndex = startIndex;
    this.width = width;
    this.height = height;
  }
}

import { UUID } from '../agent';
import { Matrix4, IVector, Axis } from '../math';
import { ICamera } from '.';


// export class PerspectiveCamera implements ICamera {
export class PerspectiveCamera implements ICamera {
  public readonly UUID: string;
  private cameraMatrix: Matrix4;

  constructor() {
    this.UUID = UUID();
    // TODO
  }

  public translate(newPosition: IVector): void {
    throw new Error('Method not implemented.');
  }

  public scale(scale: number): void {
    throw new Error('Method not implemented.');
  }

  public rotate(angle: number, axis: Axis = Axis.Z): void {
    throw new Error('Method not implemented.');
  }

  public lookAt(position: IVector): void {
    throw new Error('Method not implemented.');
  }

  public reset(): void {
    throw new Error('Method not implemented.');
  }

  public update(dt: number): boolean {
    throw new Error('Method not implemented.');
  }

  public matrix(): Matrix4 {
    return this.cameraMatrix;
  }
}

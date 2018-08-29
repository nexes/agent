import { UUID } from '../agent';
import { Matrix4, TransformationMatrix, Axis, Vector2 } from '../math';
import { ICamera, IOrthoDimension } from '../camera';


export class OrthographicCamera implements ICamera {
  public readonly UUID: string;

  private cameraMatrix: Matrix4;
  private transformation: TransformationMatrix;

  constructor(dimension: IOrthoDimension) {
    this.UUID = UUID();
    this.transformation = new TransformationMatrix();
    this.cameraMatrix = new Matrix4();
    this.cameraMatrix.setAsOrthographic(dimension);
  }

  public translate(newPosition: Vector2): void {
    this.transformation.translate(newPosition);
 }

  public scale(scale: Vector2 | number): void {
    this.transformation.scale(scale);
  }

  public rotate(angle: number, axis: Axis = Axis.Z): void {
    this.transformation.rotate(angle, axis);
  }

  public lookAt(position: Vector2, cameraSpeed: number = 1.0): void {
    // TODO
  }

  public reset(): void {
    this.transformation.clear();
  }

  public matrix(): Matrix4 {
    return this.transformation.matrix.mult(this.cameraMatrix);
  }

  public update(dt: number): boolean {
    if (this.transformation.isDirty) {
      this.transformation.update(dt);
      return true;
    }

    return false;
  }
}

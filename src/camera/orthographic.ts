import { UUID } from '../agent';
import { Matrix4, TransformationMatrix, Axis, Vector2 } from '../math';
import { ICamera, CameraEffects } from '../camera';
import { IUniformType } from '../shader';


export class OrthographicCamera implements ICamera {
  private uuid: string;
  private cameraMatrix: Matrix4;
  private cameraFx: CameraEffects;
  private _transformation: TransformationMatrix;

  constructor(originX: number, originY: number, width: number, height: number) {
    this.uuid = UUID();
    this._transformation = new TransformationMatrix();
    this.cameraMatrix = new Matrix4();
    this.cameraFx = new CameraEffects(this._transformation);

    this.cameraMatrix.setAsOrthographic({
      left: originX,
      right: width,
      top: originY,
      bottom: height,
      near: 1000,
      far: 0,
    });
  }

  public translate(newPosition: Vector2): void {
    const pos = this.transformation.position;
    this._transformation.translate(pos.add(newPosition));
 }

  public scale(scale: Vector2 | number): void {
    this._transformation.scale(scale);
  }

  public rotate(angle: number, axis: Axis = Axis.Z): void {
    this._transformation.rotate(angle, axis);
  }

  public centerOn(position: Vector2): void {
    // TODO
  }

  public follow(): void {
    // TODO
  }

  public reset(): void {
    this._transformation.clear();
  }

  public matrix(): Matrix4 {
    return this._transformation.finalMatrix().mult(this.cameraMatrix);
  }

  public update(dt: number): boolean {
    if (this._transformation.dirty || this.cameraFx.animating) {
      this.cameraFx.update(dt);
      return true;
    }

    return false;
  }

  public get transformation(): TransformationMatrix {
    return this._transformation;
  }

  public get effect(): CameraEffects {
    return this.cameraFx;
  }

  public get UUID(): string {
    return this.uuid;
  }

  public get uniform(): IUniformType {
    return {
      UUID: this.uuid,
      uniformData: this.matrix().flatten(),
    };
  }
}

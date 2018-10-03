import { UUID } from '../agent';
import { Matrix4, IVector, Axis, TransformationMatrix } from '../math';
import { ICamera, CameraEffects } from '../camera';
import { IUniformAttribute } from '../shader';


// export class PerspectiveCamera implements ICamera {
export class PerspectiveCamera implements ICamera {
  private uuid: string;
  private cameraMatrix: Matrix4;
  private cameraFx: CameraEffects;
  private _transformation: TransformationMatrix;

  constructor() {
    this.uuid = UUID();
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

  public follow(): void {
    throw new Error('Method not implemented.');
  }

  public centerOn(position: IVector): void {
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

  public get transformation(): TransformationMatrix {
    return this._transformation;
  }

  public get effect(): CameraEffects {
    return this.cameraFx;
  }

  public get UUID(): string {
    return this.uuid;
  }

  public get uniform(): IUniformAttribute {
    return {
      uuid: this.uuid,
      uniformData: this.matrix().flatten(),
    };
  }
}

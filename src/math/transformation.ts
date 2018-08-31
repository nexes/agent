import { Math, Matrix4, Vector2, Axis, ITransform } from '../math';


export class TransformationMatrix implements ITransform {
  private _dirty: boolean;
  private translateMatrix: Matrix4;
  private rotationMatrix: Matrix4;
  private scaleMatrix: Matrix4;

  constructor() {
    this._dirty = false;
    this.translateMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();
  }

  public translate(position: Vector2): void {
    this._dirty = true;
    this.translateMatrix.translate(position);
  }

  public rotate(angle: number, axis: Axis = Axis.Z): void {
    this._dirty = true;
    this.rotationMatrix.rotate(angle, axis);
  }

  public scale(scale: Vector2 | number): void {
    this._dirty = true;
    this.scaleMatrix.scale(scale);
  }

  public clear() {
    this._dirty = false;
    this.translateMatrix.setAsIdentity();
    this.rotationMatrix.setAsIdentity();
    this.scaleMatrix.setAsIdentity();
  }

  public finalMatrix(): Matrix4 {
    this._dirty = false;
    return this.translateMatrix.mult(this.rotationMatrix.mult(this.scaleMatrix));
  }

  public get dirty(): boolean {
    return this._dirty;
  }

  public get position(): Vector2 {
    const pos = this.translateMatrix.flatten().slice(12, 14);
    return new Vector2(pos[ 0 ], pos[ 1 ]);
  }
}

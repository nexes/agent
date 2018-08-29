import { Math, Matrix4, Vector2, Axis } from '../math';


export class TransformationMatrix {
  private dirty: boolean;
  private translateMatrix: Matrix4;
  private rotationMatrix: Matrix4;
  private scaleMatrix: Matrix4;

  private translateVec: Vector2;
  private scaleVec: Vector2;
  private rotationVec: Vector2;

  constructor() {
    this.dirty = false;
    this.translateMatrix = new Matrix4();
    this.rotationMatrix = new Matrix4();
    this.scaleMatrix = new Matrix4();

    this.translateVec = new Vector2();
    this.scaleVec = new Vector2();
    this.rotationVec = new Vector2();
  }

  public translate(newPos: Vector2): void {
    this.dirty = true;
    this.translateVec = newPos;
  }

  public rotate(angle: number, axis: Axis = Axis.Z): void {
    this.dirty = true;
    this.rotationVec = new Vector2(angle, axis);
  }

  public scale(scale: Vector2 | number): void {
    this.dirty = true;

    if (scale instanceof Vector2) {
      this.scaleVec = scale;

    } else {
      this.scaleVec = new Vector2(scale, scale);
    }
  }

  public clear() {
    this.dirty = false;
    this.translateMatrix.setAsIdentity();
    this.rotationMatrix.setAsIdentity();
    this.scaleMatrix.setAsIdentity();

    this.translateVec = null;
    this.rotationVec = null;
    this.scaleVec = null;
  }

  public update(dt: number): void {
    if (!this.dirty) { return; }

    if (this.translateVec) {
      const pos = this.translateMatrix.flatten().slice(12, 14);
      const currentPos = new Vector2(pos[ 0 ], pos[ 1 ]);
      const targetPos = currentPos.add({x: this.translateVec.x, y: this.translateVec.y});

      this.translateMatrix.translate(Math.lerpVec2(currentPos, targetPos, dt));
      this.translateVec = null;
    }

    if (this.scaleVec) {
      this.scaleMatrix.scale(this.scaleVec);
      this.scaleVec = null;
    }

    if (this.rotationVec) {
      this.rotationMatrix.rotate(this.rotationVec.x, this.rotationVec.y);
      this.rotationVec = null;
    }

    this.dirty = false;
  }

  public get isDirty(): boolean {
    return this.dirty;
  }

  public get matrix(): Matrix4 {
    return this.translateMatrix.mult(this.rotationMatrix.mult(this.scaleMatrix));
  }
}

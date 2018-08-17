import { IVector, IPoint } from '../math';


export class Vector2 implements IVector {
  private _x: number;
  private _y: number;

  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public add(vec: IPoint | Vector2): Vector2 {
    return new Vector2(vec.x + this.x, vec.y + this.y);
  }

  public sub(vec: IPoint | Vector2): Vector2 {
    return new Vector2(this.x - vec.x, this.y - vec.y);
  }

  public mult(vec: IPoint | Vector2): Vector2 {
    return new Vector2(this.x * vec.x, this.y * vec.y);
  }

  public div(vec: IPoint | Vector2): Vector2 | TypeError {
    if (vec.x === 0 || vec.y === 0) {
      throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y}`);
    }
    return new Vector2(this.x / vec.x, this.y / vec.y);
  }

  public dot(vec: IPoint | Vector2): number {
    return (this.x * vec.x) + (this.y * vec.y);
  }

  public length(): number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }

  public scale(scaler: number): Vector2 {
    return new Vector2(this.x * scaler, this.y * scaler);
  }

  public normalize(): Vector2 {
    const l = this.length();
    return new Vector2(this.x / l, this.y / l);
  }

  public distance(vec: IVector): number {
    const distanceVec = new Vector2(vec.x - this.x, vec.y - this.y);
    return distanceVec.length();
  }

  public get x(): number {
    return this._x;
  }

  public set x(x: number) {
    this._x = x;
  }

  public get y(): number {
    return this._y;
  }

  public set y(y: number) {
    this._y = y;
  }

  public flatten(): Float32Array {
    return new Float32Array([this.x, this.y]);
  }
}

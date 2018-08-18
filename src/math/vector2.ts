import { IVector, IPoint } from '../math';


export class Vector2 implements IVector {
  private _x: number;
  private _y: number;

  constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public add(vec: IPoint | Vector2): Vector2 {
    return new Vector2(vec.x + this._x, vec.y + this._y);
  }

  public sub(vec: IPoint | Vector2): Vector2 {
    return new Vector2(vec.x - this._x, vec.y - this._y);
  }

  public mult(vec: IPoint | Vector2): Vector2 {
    return new Vector2(this._x * vec.x, this._y * vec.y);
  }

  public div(vec: IPoint | Vector2): Vector2 | TypeError {
    if (vec.x === 0 || vec.y === 0) {
      throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y}`);
    }
    return new Vector2(this._x / vec.x, this._y / vec.y);
  }

  public dot(vec: IPoint | Vector2): number {
    return (this._x * vec.x) + (this._y * vec.y);
  }

  public length(): number {
    return Math.sqrt((this._x * this._x) + (this._y * this._y));
  }

  public scale(scaler: number): Vector2 {
    return new Vector2(this._x * scaler, this._y * scaler);
  }

  public normalize(): Vector2 {
    const l = this.length();
    return new Vector2(this._x / l, this._y / l);
  }

  public distance(vec: IVector): number {
    const distanceVec = new Vector2(vec.x - this._x, vec.y - this._y);
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
    return new Float32Array([this._x, this._y]);
  }
}

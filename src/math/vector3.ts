import { IVector, IPoint } from '../math';


export class Vector3 implements IVector {
  private _x: number;
  private _y: number;
  private _z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this._x = x;
    this._y = y;
    this._z = z;
  }

  public add(vec: IPoint | Vector3): Vector3 {
    return new Vector3(this._x + vec.x, this._y + vec.y, this._z + vec.z);
  }

  public sub(vec: IPoint | Vector3): Vector3 {
    return new Vector3(vec.x - this._x, vec.y - this._y, vec.z - this._z);
  }

  public div(vec: IPoint | Vector3): Vector3 | TypeError {
    if (vec.x === 0 || vec.y === 0 || vec.z === 0) {
      throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y} z: ${vec.z}`);
    }
    return new Vector3(this._x / vec.x, this._y / vec.y, this._z / vec.z);
  }

  public mult(vec: IPoint | Vector3): Vector3 {
    return new Vector3(this._x * vec.x, this._y * vec.y, this._z * vec.z);
  }

  public dot(vec: IPoint | Vector3): number {
    return (this._x * vec.x) + (this._y * vec.y) + (this._z * vec.z);
  }

  public scale(scaler: number): Vector3 {
    return new Vector3(this._x * scaler, this._y * scaler, this._z * scaler);
  }

  public normalize(): Vector3 {
    const l = this.length();
    return new Vector3(this._x / l, this._y / l, this._z / l);
  }

  public distance(vec: IVector): number {
    const distanceVec = new Vector3(vec.x - this._x, vec.y - this._y, vec.z - this._z);
    return distanceVec.length();
  }

  public length(): number {
    return Math.sqrt(( this._x * this._x ) + ( this._y * this._y ) + ( this._z * this._z ));
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

  public get z(): number {
    return this._z;
  }

  public set z(z: number) {
    this._z = z;
  }

  public flatten(): Float32Array {
    return new Float32Array([this._x, this._y, this._z]);
  }
}

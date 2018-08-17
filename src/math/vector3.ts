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
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  public sub(vec: IPoint | Vector3): Vector3 {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  public div(vec: IPoint | Vector3): Vector3 | TypeError {
    if (vec.x === 0 || vec.y === 0 || vec.z === 0) {
      throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y} z: ${vec.z}`);
    }
    return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
  }

  public mult(vec: IPoint | Vector3): Vector3 {
    return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
  }

  public dot(vec: IPoint | Vector3): number {
    return (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z);
  }

  public scale(scaler: number): Vector3 {
    return new Vector3(this.x * scaler, this.y * scaler, this.z * scaler);
  }

  public normalize(): Vector3 {
    const l = this.length();
    return new Vector3(this.x / l, this.y / l, this.z / l);
  }

  public distance(vec: IVector): number {
    const distanceVec = new Vector3(vec.x - this.x, vec.y - this.y, vec.z - this.z);
    return distanceVec.length();
  }

  public length(): number {
    return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ));
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
    return new Float32Array([this.x, this.y, this.z]);
  }
}

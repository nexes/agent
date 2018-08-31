import { IOrthoDimension } from '../camera';
import { Matrix4 } from './matrix4';

export { Vector2 } from './vector2';
export { Vector3 } from './vector3';
export { Matrix4 } from './matrix4';
export { Math } from './math';
export { TransformationMatrix } from './transformation';


export enum Axis {
  X,
  Y,
  Z,
}

export interface IPoint {
  x: number;
  y: number;
  z?: number;
}

export interface IRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface IVector extends IPoint {
  /**
   * Add a vector
   * @param {IVector | IPoint}	vec	a vector object
   * @returns {IVector}	a new Vector
   */
  add(vec: IVector): IVector;

  /**
   * Subtract a vector
   * @param {IVector}  vec  a vector object
   * @returns {IVector}	a new Vector
   */
  sub(vec: IVector): IVector;

  /**
   * Divide a vector
   * @param {IVector}  vec  a vector object
   * @returns {IVector}	a new Vector
   */
  div(vec: IVector): IVector | TypeError;

  /**
   * Multiply a vector
   * @param {IVector}  vec  a vector object
   * @returns {IVector}	a new Vector
   */
  mult(vec: IVector): IVector;

  /**
   * Dot product a vector
   * @param {IVector}  vec  a vector object
   * @returns {number}	the number representing the dot product
   */
  dot(vec: IVector): number;

  /**
   * Distance between vec and this vector
   * @param {IVector}  vec  the vector to get the distance to
   * @returns {number}	the distance between vec and this vector
   */
  distance(vec: IVector): number;

  /**
   * Scale a vector
   * @param {number}  scaler  the value to scale by
    * @returns {IVector}	a new scaled Vector
   */
  scale(scaler: number): IVector;

  /**
   * Normalize a vector
   * @returns {IVector}	a new normalized Vector
   */
  normalize(): IVector;

  /**
   * Magnitude of a vector
   * @returns {number}	the length of the vector
   */
  length(): number;

  /**
   * Flatten to a float32array
   * @returns {Float32Array} the float32array of x, y, z
   */
  flatten(): Float32Array;
}


export interface IMatrix {
  /**
   * Change the matrix to an identity matrix
   * @return {void}
   */
  setAsIdentity(): void;

  /**
   * Change the matrix to a orthographic projection matrix
   * @returns {void}
   */
  setAsOrthographic(dimension: IOrthoDimension): void;

  /**
   * Change the matrix to a perspective projection matrix
   * @returns {void}
   */
  setAsPerspective(): void;

  /**
   * return a new scaled matrix
   * @param {IVector | number} scaler   the value to scale the matrix
   * @return {IMatrix}  the new scaled matrix
   */
  scale(scaler: IVector | number): IMatrix;

  /**
   * return a new translated matrix
   * @param {IVector} vec   the vector to translate by
   * @return {IMatrix}  the new translated matrix
   */
  translate(vec: IVector): IMatrix;

  /**
   * return a new rotated matrix
   * @param {number} theta   the degree or radian to rotate by
   * @param {Axis} axis   the axis to rotate by, default is Z axis
   * @return {IMatrix}  the new rotated matrix
   */
  rotate(theta: number, axis: Axis): IMatrix;

  /**
   * Multiple the matrix by the given matrix and return the new matrix
   * @param {IMatrix} mat the matrix to multiple by
   * @returns {IMatrix} the product matrix
   */
  mult(mat: Matrix4): IMatrix;

  /**
   * return the matrix data as a Float32Array
   * @return {Flaot32Array}  the matrix data as an array
   */
  flatten(): Float32Array;
}


export interface ITransform {
  /**
   * @property check if the transform matrix has been changed
   * @readonly
   */
  readonly dirty: boolean;

  /**
   * @property the currnt position from the translation matrix
   * @readonly
   */
  readonly position: IVector;

  /**
   * moves the current translation matrix by the amount described in the vector
   * @param {IVector} position move the current position by this vector
   */
  translate(position: IVector): void;

  /**
   * rotate the rotation matrix by angle. Default axis is Z
   * @param {number} angle the angle to rotation.
   * @param {Axis} asix the axis to rotate around, default is Z
   */
  rotate(angle: number, axis: Axis): void;

  /**
   * scale the matrix along the x, y and z axis in uniform. if a vector is passed, scale will
   * be done by the vectors x, y, and z
   * @param {IVector|number} scale scalar
   */
  scale(scale: IVector | number): void;

  /**
   * clears the transformations underlining matrices back to identity matrices.
   */
  clear(): void;

  /**
   * Returns the final transformation matrix, multiplying the scale, rotation and translation matrix
   * @returns {IMatrix} the final transformtaion matrix
   */
  finalMatrix(): IMatrix;
}

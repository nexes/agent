import { IOrthoDimension } from '../camera';
import { Vector2 } from './vector2';
import { Matrix4 } from './matrix4';

export { Vector2 } from './vector2';
export { Vector3 } from './vector3';
export { Matrix4 } from './matrix4';


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
   * @param {Axis} axis   the axis to rotate by
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

/**
 * convert degree to radian
 * @param {number} deg  the degree to convert
 * @return {number}   the degree represented in radian
 */
export function toRadian(deg: number): number {
  const rad = (deg / 360) * 2 * Math.PI;
  return rad;
}

/**
 * convert radian to degree
 * @param {number} rad  the radian to convert
 * @return {number}   the degree
 */
export function toDegree(rad: number): number {
  return Math.round((rad / (2 * Math.PI)) * 360);
}

/**
 * linear interpolation from one point to another of time
 * @param {number} startPos the begining point
 * @param {number} endPos the end point
 * @param {number} time the time (0 - 1) that has passed
 * @returns {number} the interpolated distance between both points
 */
export function lerp(startPos: number, endPos: number, time: number): number {
  return ( (1 - time) * startPos ) + ( time * endPos );
}

/**
 * linear interpolation from one vector2 to another of time
 * @param {Vector2} startVec the begining vector
 * @param {Vector2} endVec the end vector
 * @param {number} time the time (0 - 1) that has passed
 * @returns {Vector2} the interpolated distance between both vectors
 */
export function lerpVec2(startVec: Vector2, endVec: Vector2, time: number): Vector2 {
  return new Vector2(
    lerp(startVec.x, endVec.x, time),
    lerp(startVec.y, endVec.y, time),
  );
}

/**
 * clamp the value between the min and max values.
 * @param {number} value the value to clamp
 * @param {number} min the minimum value
 * @param {number} value the maximum value
 * @returns {number} the value if it's between the min and max value, otherwise the min if value < min or max if value > max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

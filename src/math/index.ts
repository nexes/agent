export { Vector2 } from './vector2';
export { Vector3 } from './vector3';
export { Matrix4 } from './matrix4';


export enum Axis {
	X,
	Y,
	Z,
}

export interface IPoint {
	readonly x: number;
	readonly y: number;
	readonly z: number;
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
	 * return a new scaled matrix
	 * @param {number} scaler   the value to scale the matrix
	 * @return {IMatrix}  the new scaled matrix
	 */
	scale(scaler: number): IMatrix;

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
	return parseFloat(rad.toFixed(5));
}

/**
 * convert radian to degree
 * @param {number} rad  the radian to convert
 * @return {number}   the degree
 */
export function toDegree(rad: number): number {
	return Math.round((rad / (2 * Math.PI)) * 360);
}

import { Vector2 } from './vector2';


export interface IPoint {
	x: number;
	y: number;
	z?: number;
}

export interface IVector {
	add(vec: IVector): IVector;
	sub(vec: IVector): IVector;
	div(vec: IVector): IVector | TypeError;
	mult(vec: IVector): IVector;
	dot(vec: IVector): number;
	scale(scaler: number): IVector;
	normalize(): IVector;
	length(): number;
}

export interface IMatrix {
	setAsIdentity(): void;
	scale(scaler: number): IMatrix;
	translate(vec: Vector2): IMatrix;
	flatten(): Float32Array;
}

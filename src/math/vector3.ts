import { IVector, IPoint } from './types';


export class Vector3 implements IVector {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	add(vec: IPoint): Vector3
	add(vec: IVector): Vector3
	add(vec: any): Vector3 {
		return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
	}

	sub(vec: IPoint): Vector3
	sub(vec: IVector): Vector3
	sub(vec: any): Vector3 {
		return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
	}

	div(vec: IPoint): Vector3 | TypeError
	div(vec: IVector): Vector3 | TypeError
	div(vec: any): Vector3 | TypeError {
		if (vec.x === 0 || vec.y === 0 || vec.z === 0) {
			throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y} z: ${vec.z}`);
		}
		return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
	}

	mult(vec: IPoint): Vector3
	mult(vec: IVector): Vector3
	mult(vec: any): Vector3 {
		return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
	}

	dot(vec: IPoint): number
	dot(vec: IVector): number
	dot(vec: any): number {
		return (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z);
	}

	scale(scaler: number): Vector3 {
		return new Vector3(this.x * scaler, this.y * scaler, this.z * scaler);
	}

	normalize(): IVector {
		const l = this.length();
		return new Vector3(this.x / l, this.y / l, this.z / l);
	}

	length(): number {
		return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ));
	}
}
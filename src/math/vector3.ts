import { IVector, IPoint } from '../math';


export class Vector3 implements IVector {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	public add(vec: IPoint | IVector): Vector3 {
		return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
	}

	public sub(vec: IPoint | IVector): Vector3 {
		return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
	}

	public div(vec: IPoint | IVector): Vector3 | TypeError {
		if (vec.x === 0 || vec.y === 0 || vec.z === 0) {
			throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y} z: ${vec.z}`);
		}
		return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
	}

	public mult(vec: IPoint | IVector): Vector3 {
		return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
	}

	public dot(vec: IPoint | IVector): number {
		return (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z);
	}

	public scale(scaler: number): Vector3 {
		return new Vector3(this.x * scaler, this.y * scaler, this.z * scaler);
	}

	public normalize(): IVector {
		const l = this.length();
		return new Vector3(this.x / l, this.y / l, this.z / l);
	}

	public length(): number {
		return Math.sqrt(( this.x * this.x ) + ( this.y * this.y ) + ( this.z * this.z ));
	}
}

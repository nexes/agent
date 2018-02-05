import { IVector, IPoint } from './types';


export class Vector2 implements IVector {
	public readonly x: number;
	public readonly y: number;
	public readonly z: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
		this.z = 0;
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
}

interface IVector {
	add(vec: IVector): IVector;
	sub(vec: IVector): IVector;
	div(vec: IVector): IVector | TypeError;
	mult(vec: IVector): IVector;
	dot(vec: IVector): number;
	scale(scaler: number): IVector;
	normalize(): IVector;
	length(): number;
}

export class Vector2 implements IVector {
	private readonly x: number;
	private readonly y: number;

	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

	add(vec: {x: number, y: number}): Vector2
	add(vec: Vector2): Vector2
	add(vec: any): Vector2 {
		return new Vector2(vec.x + this.x, vec.y + this.y);
	}

	sub(vec: {x: number, y: number}): Vector2
	sub(vec: Vector2): Vector2
	sub(vec: any): IVector {
		return new Vector2(this.x - vec.x, this.y - vec.y);
	}

	mult(vec: {x: number, y: number}): Vector2
	mult(vec: Vector2): Vector2
	mult(vec: any): Vector2 {
		return new Vector2(this.x * vec.x, this.y * vec.y);
	}

	div(vec: {x: number, y: number}): Vector2 | TypeError
	div(vec: Vector2): Vector2 | TypeError
	div(vec: any): Vector2 | TypeError {
		if (vec.x === 0 || vec.y === 0) {
			throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y}`);
		}
		return new Vector2(this.x / vec.x, this.y / vec.y);
	}

	dot(vec: {x: number, y: number}): number
	dot(vec: Vector2): number
	dot(vec: any): number {
		return (this.x * vec.x) + (this.y * vec.y);
	}

	length(): number {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	scale(scaler: number): Vector2 {
		return new Vector2(this.x * scaler, this.y * scaler);
	}

	normalize(): Vector2 {
		const l = this.length();
		return new Vector2(this.x / l, this.y / l);
	}
}
interface IVector {
	add(vec: IVector): IVector;
	sub(vec: IVector): IVector;
	div(vec: IVector): IVector | TypeError;
	mult(vec: IVector): IVector;
	scale(scaler: number): IVector;
	normalize(): IVector;
	length(): number;
}

export class Vector2 implements IVector {
	private readonly x: number;
	private readonly y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	add(vec: Vector2): Vector2 {
		return new Vector2(vec.x + this.x, vec.y + this.y);
	}

	sub(vec: Vector2): Vector2 {
		return new Vector2(this.x - vec.x, this.y - vec.y);
	}

	mult(vec: Vector2): Vector2 {
		return new Vector2(this.x * vec.x, this.y * vec.y);
	}

	div(vec: Vector2): Vector2 | TypeError {
		if (vec.x === 0 || vec.y === 0) {
			throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y}`);
		}
		return new Vector2(this.x / vec.x, this.y / vec.y);
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
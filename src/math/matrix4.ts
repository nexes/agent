import { Vector2 } from './vector2';
import { IOrthoDimension } from '../camera';
import { IMatrix, IPoint, IVector, Axis } from '../math';


export class Matrix4 implements IMatrix {
	private data: Float32Array;

	constructor(arr?: Float32Array) {
		if (arr !== undefined && arr.length === 16) {
			this.data = arr.map((value) => value);

		} else {
			this.data = new Float32Array(16);

			this.data[ 0 ] = 1;
			this.data[ 5 ] = 1;
			this.data[ 10 ] = 1;
			this.data[ 15 ] = 1;
		}
	}

	public setAsIdentity(): void {
		this.data.fill(0);

		this.data[ 0 ] = 1;
		this.data[ 5 ] = 1;
		this.data[ 10 ] = 1;
		this.data[ 15 ] = 1;
	}

	public setAsOrthographic(dimension: IOrthoDimension) {
		this.setAsIdentity();

		this.data[ 0 ] = 2 / (dimension.right - dimension.left);
		this.data[ 5 ] = 2 / (dimension.top - dimension.bottom);
		this.data[ 10 ] = -2 / (dimension.far - dimension.near);
		this.data[ 12 ] = -1 * ((dimension.right + dimension.left) / (dimension.right - dimension.left));
		this.data[ 13 ] = -1 * ((dimension.top + dimension.bottom) / (dimension.top - dimension.bottom));
		this.data[ 14 ] = -1 * ((dimension.far + dimension.near) / (dimension.far - dimension.near));
	}

	public setAsPerspective() {
		// TODO
	}

	public scale(scaler: IPoint | number): Matrix4 {
		let x = 1;
		let y = 1;
		let z = 1;
		const _mat = new Matrix4(this.data);

		if (typeof scaler === 'object') {
			x = scaler.x;
			y = scaler.y;
			z = scaler.z || 1;
		} else {
			x = scaler;
			y = scaler;
			z = scaler;
		}

		_mat.data[ 0 ] *= x;
		_mat.data[ 5 ] *= y;
		_mat.data[ 10 ] *= z;

		return _mat;
	}

	public translate(vec: IVector | IPoint): Matrix4 {
		let x = 0;
		let y = 0;
		let z = 0;
		const _mat = new Matrix4(this.data);

		if (vec instanceof Vector2) {
			x = vec.x;
			y = vec.y;
			z = 0;

		} else {
			x = vec.x;
			y = vec.y;
			z = vec.z || 0;
		}

		_mat.data[ 12 ] += x;
		_mat.data[ 13 ] += y;
		_mat.data[ 14 ] += z;

		return _mat;
	}

	public rotate(theta: number, axis: Axis): Matrix4 {
		const _mat = new Matrix4(this.data);

		switch (axis) {
			case Axis.X:
			_mat.data[ 5 ] *= Math.cos(theta);
			_mat.data[ 6 ] *= Math.sin(theta);
			_mat.data[ 9 ] *= -(Math.sin(theta));
			_mat.data[ 10 ] *= Math.cos(theta);
			break;

			case Axis.Y:
			_mat.data[ 0 ] *= Math.cos(theta);
			_mat.data[ 2 ] *= -(Math.sin(theta));
			_mat.data[ 8 ] *= Math.sin(theta);
			_mat.data[ 10 ] *= Math.cos(theta);
			break;

			case Axis.Z:
			_mat.data[ 0 ] *= Math.cos(theta);
			_mat.data[ 1 ] *= Math.sin(theta);
			_mat.data[ 4 ] *= -(Math.sin(theta));
			_mat.data[ 5 ] *= Math.cos(theta);
			break;
		}

		return _mat;
	}

	public flatten(): Float32Array {
		return this.data;
	}
}

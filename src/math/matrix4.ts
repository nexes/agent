import { IOrthoDimension } from '../camera';
import { IMatrix, IPoint, IVector, Axis, Vector2, Vector3 } from '../math';


export class Matrix4 implements IMatrix {
  private data: Float32Array;

  constructor(arr?: Float32Array) {
    if (arr && arr.length === 16) {
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

    if (typeof scaler === 'object') {
      x = scaler.x;
      y = scaler.y;
      z = scaler.z || 1;
    } else {
      x = scaler;
      y = scaler;
      z = scaler;
    }

    this.data[ 0 ] *= x;
    this.data[ 5 ] *= y;
    this.data[ 10 ] *= z;

    return this;
  }

  public translate(vec: IVector | IPoint): Matrix4 {
    let x = 0;
    let y = 0;
    let z = 0;

    if (vec instanceof Vector2) {
      x = vec.x;
      y = vec.y;
      z = 0;

    } else if (vec instanceof Vector3) {
      x = vec.x;
      y = vec.y;
      z = vec.z;

    } else {
      x = vec.x;
      y = vec.y;
      z = vec.z || 0;
    }

    this.data[ 12 ] += x;
    this.data[ 13 ] += y;
    this.data[ 14 ] += z;

    return this;
  }

  public rotate(theta: number, axis: Axis): Matrix4 {
    switch (axis) {
      case Axis.X:
        this.data[ 5 ] *= Math.cos(theta);
        this.data[ 6 ] *= Math.sin(theta);
        this.data[ 9 ] *= -(Math.sin(theta));
        this.data[ 10 ] *= Math.cos(theta);
        break;

      case Axis.Y:
        this.data[ 0 ] *= Math.cos(theta);
        this.data[ 2 ] *= -(Math.sin(theta));
        this.data[ 8 ] *= Math.sin(theta);
        this.data[ 10 ] *= Math.cos(theta);
        break;

      case Axis.Z:
        this.data[ 0 ] *= Math.cos(theta);
        this.data[ 1 ] *= Math.sin(theta);
        this.data[ 4 ] *= -(Math.sin(theta));
        this.data[ 5 ] *= Math.cos(theta);
        break;
    }

    return this;
  }

  public mult(mat: IMatrix): IMatrix {
    const multMat = new Float32Array(16);
    const row = mat.flatten();
    let index = 0;

    for (let i = 0; i < 16; i += 4) {
      const column = this.data.slice(i, i + 4);

      for (let j = 0; j < 4; j ++) {
        const a = row[ j ] * column[ 0 ] + row[ j + 4 ] * column[ 1 ] + row[ j + 8 ] * column[ 2 ] + row[ j + 12 ] * column[ 3 ];
        multMat[ index++ ] = a;
      }
    }

    return new Matrix4(multMat);
  }

  public flatten(): Float32Array {
    return this.data;
  }
}

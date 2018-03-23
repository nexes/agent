import { IMatrix, IPoint, IVector, Axis } from '../math';
export declare class Matrix4 implements IMatrix {
    private data;
    constructor(arr?: Float32Array);
    setAsIdentity(): void;
    scale(scaler: IPoint | number): Matrix4;
    translate(vec: IVector | IPoint): Matrix4;
    rotate(theta: number, axis: Axis): Matrix4;
    flatten(): Float32Array;
}

import { IVector, IPoint } from '../math';
export declare class Vector3 implements IVector {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    constructor(x?: number, y?: number, z?: number);
    add(vec: IPoint | IVector): Vector3;
    sub(vec: IPoint | IVector): Vector3;
    div(vec: IPoint | IVector): Vector3 | TypeError;
    mult(vec: IPoint | IVector): Vector3;
    dot(vec: IPoint | IVector): number;
    scale(scaler: number): Vector3;
    normalize(): IVector;
    length(): number;
    flatten(): Float32Array;
}

import { IVector, IPoint } from '../math';
export declare class Vector2 implements IVector {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    constructor(x?: number, y?: number);
    add(vec: IPoint | Vector2): Vector2;
    sub(vec: IPoint | Vector2): Vector2;
    mult(vec: IPoint | Vector2): Vector2;
    div(vec: IPoint | Vector2): Vector2 | TypeError;
    dot(vec: IPoint | Vector2): number;
    length(): number;
    scale(scaler: number): Vector2;
    normalize(): Vector2;
    flatten(): Float32Array;
}

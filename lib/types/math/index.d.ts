import { IOrthoDimension } from '../camera';
export { Vector2 } from './vector2';
export { Vector3 } from './vector3';
export { Matrix4 } from './matrix4';
export declare enum Axis {
    X = 0,
    Y = 1,
    Z = 2,
}
export interface IPoint {
    readonly x: number;
    readonly y: number;
    readonly z: number;
}
export interface IVector extends IPoint {
    add(vec: IVector): IVector;
    sub(vec: IVector): IVector;
    div(vec: IVector): IVector | TypeError;
    mult(vec: IVector): IVector;
    dot(vec: IVector): number;
    scale(scaler: number): IVector;
    normalize(): IVector;
    length(): number;
    flatten(): Float32Array;
}
export interface IMatrix {
    setAsIdentity(): void;
    setAsOrthographic(dimension: IOrthoDimension): void;
    setAsPerspective(): void;
    scale(scaler: number): IMatrix;
    translate(vec: IVector): IMatrix;
    rotate(theta: number, axis: Axis): IMatrix;
    flatten(): Float32Array;
}
export declare function toRadian(deg: number): number;
export declare function toDegree(rad: number): number;

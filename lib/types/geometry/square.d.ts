import { IRenderable } from '../renderer';
import { IVertexAttribute } from '../shader/shader';
export declare class Square implements IRenderable {
    private vbo;
    private bufferId;
    constructor(x: number, y: number, width: number, height: number);
    setColor(r: number, g: number, b: number, a: number): void;
    setTexture(): void;
    vertexAttributes(): IVertexAttribute;
    colorAttributes(): IVertexAttribute;
    bindBuffer(gl: WebGLRenderingContext): void;
}

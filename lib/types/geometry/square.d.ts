import { IRenderable } from '../renderer';
import { IVertexAttribute } from '../shader';
export declare class Square implements IRenderable {
    private vbo;
    private bufferId;
    private attribData;
    constructor(x: number, y: number, width: number, height: number);
    verticeCount(): number;
    setColor(r: number, g: number, b: number, a: number): void;
    setTexture(): void;
    vertexAttributes(): IVertexAttribute;
    colorAttributes(): IVertexAttribute;
    enableBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void;
}

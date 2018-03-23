import { Matrix4 } from '../math';
export declare enum ShaderType {
    Vertex,
    Fragment,
}
export interface IShaderAttrib {
    name: string;
    id: number | WebGLUniformLocation;
}
export interface IVertexAttribute {
    readonly size: number;
    readonly normalized: boolean;
    readonly stride: number;
    readonly offset: number;
}
export declare class Shader {
    private shaderData;
    private vertAttributes;
    constructor();
    setShaderData(gl: WebGLRenderingContext, type: ShaderType, code: string): void;
    readonly ID: WebGLShader;
    readonly Attributes: IShaderAttrib[];
    readonly Uniforms: IShaderAttrib[];
    readonly Varyings: IShaderAttrib[];
    getVertexAttribFor(attName: string): IVertexAttribute | undefined;
    setVertexAttribFor(attName: string, attribute: IVertexAttribute): void;
    setUniform(gl: WebGLRenderingContext, uniformName: string, data: Matrix4 | Float32Array | number): void;
    private compileSource(gl, type, source);
}

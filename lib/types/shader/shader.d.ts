import { ShaderType, IAttributeValue, IShaderAttributeName, IUniformValue } from '.';
export declare class Shader {
    private shaderData;
    private uniformData;
    private attributeData;
    constructor();
    setShaderSource(gl: WebGLRenderingContext, type: ShaderType, code: string): void;
    readonly ID: WebGLShader;
    readonly Attributes: Map<IShaderAttributeName, IAttributeValue>;
    readonly Uniforms: Map<IShaderAttributeName, IUniformValue>;
    readonly Varyings: IShaderAttributeName[];
    setAttributeDataFor(attName: string, attribute: IAttributeValue): void;
    setAttributeIDFor(attributeName: string, attributeID: number): void;
    setUniformDataFor(uniformName: string, uniformData: IUniformValue): void;
    setUniformIDFor(uniformName: string, uniformID: WebGLUniformLocation): void;
    private compileSource(gl, type, source);
}

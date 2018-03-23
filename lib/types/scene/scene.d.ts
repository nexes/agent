import { IRenderable } from '../renderer';
import { Shader, ShaderType } from '../shader/shader';
export declare class Scene {
    private renderables;
    private shaders;
    private programId;
    private programLinked;
    constructor();
    addDrawable(...item: IRenderable[]): void;
    preRender(gl: WebGLRenderingContext): void;
    render(gl: WebGLRenderingContext): void;
    addShader(gl: WebGLRenderingContext, type: ShaderType, data: string): void;
    shader(shader: ShaderType): Shader;
}

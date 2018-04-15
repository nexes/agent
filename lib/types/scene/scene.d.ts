import Shader, { ShaderType } from '../shader';
import { IRenderable } from '../renderer';
import { ICamera } from '../camera';
export declare class Scene {
    private camera;
    private renderables;
    private shaders;
    private programId;
    private programLinked;
    constructor();
    addDrawable(...item: IRenderable[]): void;
    addCamera(camera: ICamera): void;
    addShader(gl: WebGLRenderingContext, type: ShaderType, data: string): void;
    shader(shader: ShaderType): Shader;
    render(gl: WebGLRenderingContext): void;
    private enableAttributes(gl);
    private enableUniforms(gl);
}

import { ShaderType } from '../shader/shader';
import { Scene } from '../scene/scene';

export interface IRenderable {
	setColor(r: number, g: number, b: number, a: number): void;
	setTexture(): void;
	bindBuffer(gl: WebGLRenderingContext): void;
}

export interface IRenderer {
	aspect(): number;
	render(scene: Scene): void;
	resize(x: number, y: number): void;
}

export interface IRenderOptions {
	width: number;
	height: number;
	fullscreen?: boolean;
	domCanvas?: HTMLCanvasElement;
	glContext?: WebGLRenderingContext;
}

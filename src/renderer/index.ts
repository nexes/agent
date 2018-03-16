import { ShaderType } from '../shader/shader';
import { Scene } from '../scene/scene';

export { WebGLRenderer } from '../renderer/webGLRenderer';

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
	readonly width: number;
	readonly height: number;
	readonly fullscreen?: boolean;
	readonly domCanvas?: HTMLCanvasElement;
	readonly glContext?: WebGLRenderingContext;
}

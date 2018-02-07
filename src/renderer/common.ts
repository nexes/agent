import { shaderType } from '../shader/common';

export interface IRenderable {
	setColor(r: number, g: number, b: number, a: number): void;
	setTexture(): void;
	setBuffer(gl: WebGLRenderingContext): void;
}

export interface IRenderer {
	aspect(): number;
	render(item: IRenderable): void;
	resize(x: number, y: number): void;
	setShader(type: shaderType, shaderData: string): void;
}

export interface IRenderOptions {
	width: number;
	height: number;
	fullscreen?: boolean;
	domCanvas?: HTMLCanvasElement;
	glContext?: WebGLRenderingContext;
}

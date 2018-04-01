import { ShaderType, IAttributeValue } from '../shader';
import { Scene } from '../scene/scene';

export { WebGLRenderer } from '../renderer/webGLRenderer';

export interface IRenderable {
	/**
	 * set the color of the renderable object
	 * @param {number} r	the red value
	 * @param {number} g	the green value
	 * @param {number} b	the blue value
	 * @param {number} a	the alpha value
	 */
	setColor(r: number, g: number, b: number, a: number): void;

	/**
	 * set the renderable's texture
	 */
	setTexture(): void;

	/**
	 * must be called at lease once before rendering the renderable.
	 * This will bind and describe the buffer
	 * @param {WebGLRenderingContext}	gl	webGLrendering context
	 * @param {WebGLProgram}	program	the program id for the shaders
	 */
	prepareBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void;

	/**
	 * describe the attribute data for the renderable.
	 * @param {string}	attName	the attribute name found in the shader
	 * @param {IVertexAttribute}	attribute	the attribute object describing the renderable
	 */
	setVertexAttributeFor(attName: string, attribute: IAttributeValue): void;

	/**
	 * return the number of vertices this renderable will have
	 * @returns {number}	the number of vertices
	 */
	verticeCount(): number;
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

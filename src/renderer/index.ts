import { ShaderType, IVertexAttribute } from '../shader';
import { Scene } from '../scene/scene';
import { Texture } from './texture';

export { WebGLRenderer } from './webGLRenderer';
export { Texture } from './texture';

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
	setTexture(texture: Texture): void;

	/**
	 * must be called at lease once before rendering the renderable.
	 * This will bind and describe the buffer
	 * @param {WebGLRenderingContext}	gl	webGLrendering context
	 * @param {WebGLProgram}	program	the program id for the shaders
	 */
	enableBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void;

	/**
	 * return the number of vertices this renderable will have
	 * @returns {number}	the number of vertices
	 */
	verticeCount(): number;

	/**
	 * get the vertexAttribute object for this renderalbe, describing how the vertex data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing vertex layout
	 */
	vertexAttributes(): IVertexAttribute;

	/**
	 * get the colorAttribute object for this renderalbe, describing how the color data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing color layout
	 */
	colorAttributes(): IVertexAttribute;

	/**
	 * get the textureAttribute object for this renderalbe, describing how the texture data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing texture layout
	 */
	textureAttributes(): IVertexAttribute;
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

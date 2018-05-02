import { IVertexAttribute } from '../shader';
import { Scene } from '../scene/scene';
import { Texture } from './texture';

export { Texture } from './texture';
export { Engine as default } from './engine';


export interface IRenderable {
	readonly UUID: number;

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
	 */
	enableBuffer(gl: WebGLRenderingContext): void;

	/**
	 * this will unbind the renderables buffer array and texture if one is set
	 * @param {WebGLRenderingContext}	gl	webGLrendering context
	 */
	disableBuffer(gl: WebGLRenderingContext): void;

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

export interface IEngineOptions {
	/**
	 * @property {number}	width	-the width of the Canvas
	 */
	readonly width: number;

	/**
	 * @property	{number} height	-the height of the Canvas
	 */
	readonly height: number;

	/**
	 * @property	{boolean}	fullscreen	-optional if the Canvas will be the size of the window
	 */
	readonly fullscreen?: boolean;

	/**
	 * @property	{HTMLCanvasElement}	domCanvas	-optional html canvas, if one is not passed one will be created and inserted
	 */
	readonly domCanvas?: HTMLCanvasElement;

	/**
	 * @property	{WebGLRenderingContext}	glContext	-optional WebGL context, if one is not passed one will be created
	 */
	readonly glContext?: WebGLRenderingContext;
}

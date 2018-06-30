import Texture, { ITextureJSON, SpriteSheet } from '../texture';
import { IVertexAttribute, IShaderAttributeName, IAttributeValue } from '../shader';

export { Mesh } from './mesh';
export { Square } from './square';


export interface ITileOptions {
	singleTileWidth: number;
	singleTileHeight: number;
}

export interface IRenderable {
	readonly UUID: string;

	/**
	 * @description	set the color of the renderable object
	 * @param {number} r	the red value
	 * @param {number} g	the green value
	 * @param {number} b	the blue value
	 * @param {number} a	the alpha value
	 */
	setColor(r: number, g: number, b: number, a: number): void;

	/**
	 * @description set the renderable's texture
	 * @param {Texture} texture The texture this renderable will use
	 */
	setTexture(texture: Texture): void;

	/**
	 * @description	set the renderable to use a sprite sheet
	 * @param {SpriteSheet}	sheet	the sprite sheet texture to use
	 * @param {ITextureJSON}	data 	the TextureJSON object describing how to use the sprite sheet
	 */
	setSpriteSheet(sheet: SpriteSheet): void;

	/**
	 * must be called at lease once before rendering the renderable.
	 * This will bind and describe the buffer and enable the renderables vertex attributes
	 * @param {WebGLRenderingContext}	gl	webGLrendering context
	 * @param {Map<IShaderAttributeName, IAttributeValue>} vertexAttributes	A map of the vertex attributes that describe this renderable
	 */
	enableBufferData(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void;

	/**
	 * @description this will unbind the renderables buffer array and texture if one is set
	 * @param {WebGLRenderingContext}	gl	webGLrendering context
	 * @param {Map<IShaderAttributeName, IAttributeValue>} vertexAttributes	A map of the vertex attributes that describe this renderable
	 */
	disableBuffer(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void;

	/**
	 * @description return the number of vertices this renderable will have
	 * @returns {number}	the number of vertices
	 */
	verticeCount(): number;

	/**
	 * @description get the vertexAttribute object for this renderalbe, describing how the vertex data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing vertex layout
	 */
	vertexAttributes(): IVertexAttribute;

	/**
	 * @description get the colorAttribute object for this renderalbe, describing how the color data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing color layout
	 */
	colorAttributes(): IVertexAttribute;

	/**
	 * @description get the textureAttribute object for this renderalbe, describing how the texture data is layed out per vertex
	 * @returns	{IVertexAttribute}	object describing texture layout
	 */
	textureAttributes(): IVertexAttribute;
}

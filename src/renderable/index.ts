import Texture from '../texture';
import { IVertexAttribute, IShaderAttributeName, IAttributeValue } from '../shader';

export { Mesh } from './mesh';
export { Tile } from './tile';


export interface ITileOptions {
  rowLength: number;
  columnLength: number;
  width: number;
  height: number;
}

export interface IRenderable {
  readonly UUID: string;

  /**
   * set the color of the renderable object
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
   * must be called at lease once before rendering the renderable.
   * This will bind and describe the buffer and enable the renderables vertex attributes
   * @param {WebGLRenderingContext}	gl	webGLrendering context
   * @param {Map<IShaderAttributeName, IAttributeValue>} vertexAttributes	A map of the vertex attributes that describe this renderable
   */
  enableBufferData(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void;

  /**
   * this will unbind the renderables buffer array and texture if one is set
   * @param {WebGLRenderingContext}	gl	webGLrendering context
   * @param {Map<IShaderAttributeName, IAttributeValue>} vertexAttributes	A map of the vertex attributes that describe this renderable
   */
  disableBuffer(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void;

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

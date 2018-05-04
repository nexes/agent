export { Texture } from './texture';
export { Engine as default } from './engine';


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

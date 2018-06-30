import Texture, { ITextureJSON, stringToTextureJSON, Sprite } from '../texture';


export class SpriteSheet extends Texture {
	private spriteList: Map<string, Sprite>;
	private levelJSON: ITextureJSON;


	constructor(gl: WebGLRenderingContext) {
		super(gl);
		this.spriteList = new Map();
		this.levelJSON = null;
	}

	/**
	 * @description Create an individual sprite from the sprite sheet
	 * @param {number} frames	the number of frames for this sprite, 1 if static
	 * @param {number} xoffset the X offset where the sprite begins
	 * @param {number} yoffset the Y offset where the sprite begins
	 * @param {number} width	the width of the sprite tile
	 * @param {number} height the height of the sprite tile
	 * @returns {Sprite}	a sprite object
	 */
	public generateSprite(frames: number, xoffset: number, yoffset: number, width: number, height: number): Sprite {
		const s = new Sprite(frames, xoffset, yoffset, width, height);
		this.spriteList.set(s.UUID, s);

		return s;
	}

	/**
	 * @description	load the image into webgl, rendering will be determined by the level data passed
	 * @param {string}	resource	the image file to load
	 * @param {string | ITextureJSON}	data	a json string or ITextureJSON representing the level layout
	 * @returns {Promise} promise when the image has or hasn't been loaded
	 */
	public loadResourceWithData(resource: string, data: string | ITextureJSON): Promise<boolean> {
		// TODO: async await maybe??
		if (typeof data === 'string') {
			data = stringToTextureJSON(data);
		}
		this.levelJSON = data;

		return this.loadResource(resource);
	}
}

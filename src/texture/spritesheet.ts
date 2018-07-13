import Texture, {
  ITextureJSON,
  stringToTextureJSON,
  Sprite,
  SpriteTile,
} from '../texture';


export class SpriteSheet extends Texture {
  private spriteList: Map<string, Sprite>;
  private levelJSON: ITextureJSON;


  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.spriteList = new Map();
    this.levelJSON = null;
  }

  /**
   * Create an individual sprite from the sprite sheet
   * @param {number} frames	the number of frames for this sprite, 1 if static
   * @param {number} xoffset the X offset where the sprite begins
   * @param {number} yoffset the Y offset where the sprite begins
   * @param {number} width	the width of the sprite tile
   * @param {number} height the height of the sprite tile
   * @returns {Sprite}	a sprite object
   */
  public generateSprite(startIndex: number, frames: number, width: number, height: number): Sprite {
    const s = new Sprite(startIndex, frames, width, height);
    this.spriteList.set(s.UUID, s);

    return s;
  }

  /**
   * load the image into webgl, rendering will be determined by the level data passed
   * @param {string}	resource	the image file to load
   * @param {string | ITextureJSON}	data	a json string or ITextureJSON representing the level layout
   * @returns {Promise} promise when the image has or hasn't been loaded
   */
  public loadResourceWithData(resource: string, data: string | ITextureJSON): Promise<boolean> {
    // TODO: async await maybe??
    if (typeof data === 'string') {
      data = stringToTextureJSON(data);

      if (!data) {
        return Promise.reject(false);
      }
    }

    this.levelJSON = data;
    return this.loadResource(resource);
  }

  /**
   * describe the sprite tile at the index from the json data passed from loadResource
   * @param {number}	index	the index coorisponding to the data array from the json data
   * @returns {SpriteTile}	the tile object describing that part of the sprite sheet
   */
  public textureForIndex(index: number): SpriteTile {
    const rowLen = Math.floor(this.width() / this.levelJSON.tileWidth);
    const tile: SpriteTile = {
      x: 0,
      y: 0,
      width: this.levelJSON.tileWidth / this.width(),
      height: this.levelJSON.tileHeight / this.height(),
      hasTexture: false,
    };

    if (index < this.levelJSON.layers[0].data.length && this.levelJSON.layers[ 0 ].data[ index ] !== 0) {
      // TODO: fix, this -1 is because Tiled adds 1 to the export data
      index = this.levelJSON.layers[ 0 ].data[ index ] - 1;
      const yOffset = Math.floor(index / rowLen);
      const xOffset = Math.floor(index % rowLen);

      tile.x = (xOffset * this.levelJSON.tileWidth) / this.width();
      tile.y = (yOffset * this.levelJSON.tileHeight) / this.height();
      tile.hasTexture = true;
    }

    return tile;
  }
}

import Texture, {
  ITextureJSON,
  stringToTextureJSON,
  Sprite,
  ITextureTile,
  ISpriteTile,
} from '../texture';


export class SpriteSheet extends Texture {
  private levelJSON: ITextureJSON;


  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.levelJSON = null;
  }

  /**
   * Create an individual sprite from the sprite sheet
   * @param {number} frames	the number of frames for this sprite
   * @param {number} animationSpeed  the number of frames per second, e.g 4 will display frames 0 - 3 per second
   * @param {ISpriteTile} tile a SpriteTile object describing the sprites tiles.
   * @param {number} tile.x how far to the right we need to go to find the first frame
   * @param {number} tile.y how far down we need to go to find the first frame
   * @param {number} tile.width the width of the sprite tile
   * @param {number} tile.height the height of the sprite tile
   * @param {number} tile.column optional, the number of tiles in each column
   * @param {number} tile.row optional, the number of rows
   * @returns {Sprite}	a sprite object
   */
  public generateSprite(frames: number, animationSpeed: number, tile: ISpriteTile): Sprite {
    const startTile: ISpriteTile = {
      x: tile.x / this.width(),
      y: tile.y / this.height(),
      width: tile.width / this.width(),
      height: tile.height / this.height(),
      row: tile.row,
      column: tile.column,
    };

    return new Sprite(
      frames,
      animationSpeed,
      startTile,
    );
  }

  /**
   * load the image into webgl, rendering will be determined by the level data passed
   * @param {string}	resource	the image file to load
   * @param {string | ITextureJSON}	data	a json string or ITextureJSON representing the level layout
   * @returns {Promise} promise when the image has or hasn't been loaded
   */
  public loadResourceWithData(resource: string, data: string | ITextureJSON): Promise<WebGLTexture> {
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
  public textureForIndex(index: number): ITextureTile {
    // TODO: this needs to be better thought out, what if the textures don't go to the edge of the image
    const rowLen = Math.floor(this.width() / this.levelJSON.tileWidth);
    const tile: ITextureTile = {
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

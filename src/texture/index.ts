export { Texture as default } from './texture';
export { Sprite } from './sprite';
export { SpriteSheet } from './spritesheet';

export interface ITextureLayer {
  data: number[];
  x: number;
  y: number;
}

export interface ITextureJSON {
  tileWidth: number;
  tileHeight: number;
  tileCountX: number;
  tileCountY: number;
  layers: ITextureLayer[];
}

export interface ITextureTile {
  x: number;
  y: number;
  width: number;
  height: number;
  hasTexture: boolean;
}

export interface ISpriteTile {
  x: number;
  y: number;
  width: number;
  height: number;
  row?: number;
  column?: number;
}

/**
 * @description	parse a json string into a Texture json object describing the level layout
 * @param	{string}	jsonStr	the string representation of the json object
 * @returns {ITextureJSON | undefined}	Texture json object or undefined
 */
export function stringToTextureJSON(jsonStr: string): ITextureJSON | undefined {
  try {
    const j = JSON.parse(jsonStr);

    const _layers: ITextureLayer[] = [];
    for (const layer of j.layers) {
      const texLayer: ITextureLayer = {
        data: layer.data,
        x: layer.x || -1,
        y: layer.y || -1,
      };
      _layers.push(texLayer);
    }

    return {
      tileWidth: j.tilewidth || -1,
      tileHeight: j.tileheight || -1,
      tileCountX: j.width || -1,
      tileCountY: j.height || -1,
      layers: _layers,
    };

  } catch (e) {
    console.log('Error parsing TextureJSON ', e);
    return undefined;
  }
}

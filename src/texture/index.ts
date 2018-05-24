export { Texture as default } from './texture';

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

export interface ITextureOptions {
	subWidth: number;
	subHeight: number;
	subX: number;
	subY: number;
}

export function stringToTextureJSON(jsonStr: string): ITextureJSON | undefined {
	try {
		const j = JSON.parse(jsonStr);

		const _layers: ITextureLayer[] = [];
		for (const layer of j.layers) {
			const texLayer: ITextureLayer = {
				data: layer.data,
				x: layer.x,
				y: layer.y,
			};
			_layers.push(texLayer);
		}

		return {
			tileWidth: j.tilewidth,
			tileHeight: j.tileheight,
			tileCountX: j.width,
			tileCountY: j.height,
			layers: _layers,
		};

	} catch (e) {
		console.log('Error parsing TextureJSON ', e);
		return undefined;
	}
}

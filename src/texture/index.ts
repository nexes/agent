export { Texture as default } from './texture';

export interface ITextureJSON {
	tileWidth: number;
	tileHeight: number;
	tileCountX: number;
	tileCountY: number;
	layers: [
	{
		data: number[];
		width: number;
		height: number;
		x: number;
		y: number;
	}
	];
}

export interface ITextureOptions {
	subWidth: number;
	subHeight: number;
	subX: number;
	subY: number;
}

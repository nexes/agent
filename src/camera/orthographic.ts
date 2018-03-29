import Matrix4 from '../math';
import { ICamera } from '.';


export interface IOrthoDimension {
	left: number;
	right: number;
	top: number;
	bottom: number;
	near: number;
	far: number;
}

// export class OrthographicCamera implements ICamera {
export class OrthographicCamera implements ICamera {
	private cameraMatrix: Matrix4;
	private dimension: IOrthoDimension;

	constructor(dimension: IOrthoDimension) {
		this.dimension = dimension;
		this.cameraMatrix = new Matrix4();
		this.cameraMatrix.setAsOrthographic(dimension);
	}

	public flatten(): Float32Array {
		return this.cameraMatrix.flatten();
	}
}

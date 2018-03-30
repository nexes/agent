import { Matrix4 } from '../math';
import { ICamera } from '.';


// export class PerspectiveCamera implements ICamera {
export class PerspectiveCamera implements ICamera {
	private cameraMatrix: Matrix4;

	constructor() {
		// TODO
	}

	public matrix(): Matrix4 {
		return this.cameraMatrix;
	}
}

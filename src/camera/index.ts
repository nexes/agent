export { PerspectiveCamera } from './perspective';
export { OrthographicCamera, IOrthoDimension } from './orthographic';


export interface ICamera {
	flatten(): Float32Array;
}

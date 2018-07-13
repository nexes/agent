import { Matrix4 } from '../math';

export { PerspectiveCamera } from './perspective';
export { OrthographicCamera, IOrthoDimension } from './orthographic';


export interface ICamera {
  matrix(): Matrix4;
}

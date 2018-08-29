import { Matrix4, IVector, Axis } from '../math';
export { PerspectiveCamera } from './perspective';
export { OrthographicCamera } from './orthographic';


export interface IOrthoDimension {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
}

export interface ICamera {
  readonly UUID: string;
  /**
   * Move the camera according to the vector
   * @param {IVector} newPosition the point we want to move the camera to
   */
  translate(newPosition: IVector): void;

  /**
   * Scale the camera in or out
   * @param {number} scale amount to scale along the x, y, z axis
   */
  scale(scale: number): void;

  /**
   * Rotate the camera around the given axis
   * @param {number} angle the angle to rotate
   * @param {Axis} which axis to rotate around. Default is Z axis
   */
  rotate(angle: number, axis: Axis): void;

  /**
   * Move the center of the camera to the given position
   * @param {IVector} position the position to move towards
   * @param {number} cameraSpeed  the speed of the camera movement [0.01 - 1.0]. Default 1.0
   */
  lookAt(position: IVector, cameraSpeed: number): void;

  /**
   * Reset the camera to it's original position, what ever it was initalized as. This will effectivly make the transform matrix an identity
   */
  reset(): void;

  /**
   * Return the cameras matrix with subsequent transforms
   * @returns {Matrix4} cameras matrix
   */
  matrix(): Matrix4;

  /**
   * update the changes done to the camera based on the given delta time. If an update occured, than update will return true
   * @param {number} dt the change in time
   * @returns {boolean} true if the camera matrix have made any changes, false if no changes were done
   */
  update(dt: number): boolean;
}

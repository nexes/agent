import { Matrix4, IVector, Axis, TransformationMatrix } from '../math';
import { CameraEffects } from './effects';

export { PerspectiveCamera } from './perspective';
export { OrthographicCamera } from './orthographic';
export { CameraEffects } from './effects';


export interface IOrthoDimension {
  left: number;
  right: number;
  top: number;
  bottom: number;
  near: number;
  far: number;
}

export interface ICamera {
  /**
   * @property the unique id for this object
   * @readonly
   */
  readonly UUID: string;


  /**
   * @property the transformation matrix for the camera. There should be few reasons to access this directly
   * @readonly
   */
  readonly transformation: TransformationMatrix;

  /**
   * @property the transformation matrix for the camera. There should be few reasons to access this directly
   * @readonly
   */
  readonly effect: CameraEffects;

  /**
   * Move the camera from it's current position by the the vector passed in
   * @param {IVector} newPosition describes how far we want to move our camera from where it's at now.
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
   * @param {Axis} axis which axis to rotate around. Default is Z axis
   */
  rotate(angle: number, axis: Axis): void;

  /**
   *  TODO
   */
  follow(): void;

  /**
   * Center the camera to this position. This can be used as the camera's starting point
   * @param {IVector} position the position to center around
   */
  centerOn(position: IVector): void;

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

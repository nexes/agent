import { Vector2 } from '../math';


class AgentMath {

/**
 * convert degree to radian
 * @param {number} deg  the degree to convert
 * @return {number}   the degree represented in radian
 */
  public static toRadian(degree: number): number {
    return (degree / 360) * 2 * Math.PI;
  }

/**
 * convert radian to degree
 * @param {number} rad  the radian to convert
 * @return {number}   the degree
 */
  public static toDegree(radian: number): number {
    return Math.round((radian / (2 * Math.PI)) * 360);
  }

  /**
   * linear interpolation from one point to another of time
   * @param {number} startPos the begining point
   * @param {number} endPos the end point
   * @param {number} time the time (0 - 1) that has passed
   * @returns {number} the interpolated distance between both points
   */
  public static lerp(startPos: number, endPos: number, time: number): number {
    return ( (1 - time) * startPos ) + ( time * endPos );
  }

  /**
   * linear interpolation from one vector2 to another of time
   * @param {Vector2} startVec the begining vector
   * @param {Vector2} endVec the end vector
   * @param {number} time the time (0 - 1) that has passed
   * @returns {Vector2} the interpolated distance between both vectors
   */
  public static lerpVec2(startVec: Vector2, endVec: Vector2, time: number): Vector2 {
    return new Vector2(
      this.lerp(startVec.x, endVec.x, time),
      this.lerp(startVec.y, endVec.y, time),
    );
  }

  /**
   * clamp the value between the min and max values.
   * @param {number} value the value to clamp
   * @param {number} min the minimum value
   * @param {number} value the maximum value
   * @returns {number} the value if it's between the min and max value, otherwise the min if value < min or max if value > max
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * A Hermite function returning a value between 0 and 1 along an s-curve
   * @param {number} t the source value to interpolate
   * @returns {number} the interpolated value along the s-curve between [0-1]
   */
  public static smoothStep(t: number): number {
    const tt = this.clamp(t, 0, 1);
    return tt * tt * (3.0 - 2.0 * tt);
  }

  /**
   * A Hermite function returning a value between 0 and 1 along an s-curve, more accurate than smooth step
   * @param {number} t the source value to interpolate
   * @returns {number} the interpolated value along the s-curve between [0-1]
   */
  public static smootherStep(t: number): number {
    const tt = this.clamp(t, 0, 1);
    return tt * tt * tt * (tt * (tt * 6 - 15) + 10);
  }

  // TODO
  public static random(): number {
    return Math.random();
  }

  private static x = 34;
}

export { AgentMath as Math };

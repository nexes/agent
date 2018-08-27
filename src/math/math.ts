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

  public static perlinNoise2d(x: number, y: number): number {
    // these four are the x an y coords that create the square that surrounds the x, y params.
    // we will get a random gradient vector for each and get the dot product between that vector and x, y params
    //
    // [xi,yi]_______[xii,yi]
    // |                    |
    // |      (x, y)        |
    // |                    |
    // [xi,yii]______[xii,yii]

    // these are the four index values to use for our table lookup, this is also the unit square around our x and y input
    const xi = Math.floor(x) & 0xFF;
    const yi = Math.floor(y) & 0xFF;
    const xii = xi + 1;
    const yii = yi + 1;

    // normalizes the x and y between [0-1]. This keeps our x and y inside our square when we get the dot product
    // of our random gradients. Our gradient vectors are 1,1
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    // place the normalized x and y along our s-curve function, this will smooth our output
    const u = this.smootherStep(xf);
    const v = this.smootherStep(yf);

    // get a gradient vector from a sudo random value from our perlinTable. gx0 and gy0 is one vector, gx1 and gy1 is the other
    // these variables will be the dot product between the random gradient vector anad our x, y
    const gx0 = this.gradient2d(this.perlinTable[ this.perlinTable[ xi ] + yi ], xf, yf);
    const gy0 = this.gradient2d(this.perlinTable[ this.perlinTable[ xi ] + yii ], xf, yf - 1);
    const gx1 = this.gradient2d(this.perlinTable[ this.perlinTable[ xii ] + yi ], xf - 1, yf);
    const gy1 = this.gradient2d(this.perlinTable[ this.perlinTable[ xii ] + yii ], xf - 1, yf - 1);

    const noiseX = this.lerp(gx0, gx1, u);
    const noiseY = this.lerp(gy0, gy1, u);
    const final = this.lerp(noiseX, noiseY, v);

    return final;
  }

  private static perlinTable: Float32Array = (() => {
    const t = new Float32Array(512);
    // Hash table defined by Ken Perlin
    // we want to set this up once, and automatically when the Math class is imported anywhere.
    // we dont want to have to do this array setup every time we need to use Perlin noise.
    const permutation = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
      8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
      35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
      134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41,
      55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89,
      18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226,
      250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
      189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172,
      9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
      251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
      49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
      138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];

    for (let i = 0; i < 256; i++) {
      t[ i ] = permutation[ i ];
      t[ i + 256 ] = permutation[ i ];
    }
    return t;
  }) ();

  private static gradient2d(hash: number, x: number, y: number): number {
    // this is explained in "Improving Noise" by Ken Perlin (https://mrl.nyu.edu/~perlin/paper445.pdf)
    switch (hash & 0xF) {
      case 0x00: return x + y;  // (1, 1)
      case 0x01: return -x + y; // (-1, 1)
      case 0x02: return x - y;  // (1, -1)
      case 0x03: return -x - y; // (-1, -1)
      default: return 0;
    }
  }
}

export { AgentMath as Math };

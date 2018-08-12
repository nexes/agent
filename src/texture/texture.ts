export class Texture {
  private glCtx: WebGLRenderingContext;
  private textureID: WebGLTexture;
  private _width: number;
  private _height: number;

  constructor(gl: WebGLRenderingContext) {
    this.glCtx = gl;
    this.textureID = null;
    this._width = 0;
    this._height = 0;
  }

  /**
   * @param {string} resource	path to the image file to load
   * @returns {Promise} boolean promise the image loaded
   */
  public loadResource(resource: string): Promise<WebGLTexture> {
    // TODO: async await maybe??
    const gl = this.glCtx;

    if (this.textureID === null) {
      this.textureID = gl.createTexture();
    }

    return new Promise<WebGLTexture>((resolve, reject) => {
      const imgData = new Image();

      imgData.onload = () => {
        this._width = imgData.width;
        this._height = imgData.height;

        gl.bindTexture(gl.TEXTURE_2D, this.textureID);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgData);

        // check for power of two
        if ((this._width & (this._width - 1)) === 0 &&
            (this._height & (this._height - 1)) === 0) {
          gl.generateMipmap(gl.TEXTURE_2D);

        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        resolve(this.textureID);
      };

      imgData.onerror = (e) => {
        console.log('Error loading texture image', e);
        reject(-1);
      };

      imgData.src = resource;
    });
  }

  /**
   * the width of the image
   */
  public width(): number {
    return this._width;
  }

  /**
   * the height of the image
   */
  public height(): number {
    return this._height;
  }

  /**
   * the webGL texture Id
   */
  public ID(): WebGLTexture {
    return this.textureID;
  }
}

import { UUID } from '../agent';
import Texture, { SpriteSheet, ITextureTile } from '../texture';
import { IRenderable, ITileOptions } from '../renderable';
import { IVertexAttribute, IShaderAttributeName, IAttributeValue } from '../shader';


export class Mesh implements IRenderable {
  public readonly UUID: string;

  private tileOpts: ITileOptions;
  private vbo: Float32Array;
  private bufferId: WebGLBuffer;
  private texture: Texture;

  /**
   * Create a 2D mesh (grid).
   */
  constructor(x: number, y: number, tileOptions: ITileOptions) {
    this.UUID = UUID();
    this.tileOpts = tileOptions;
    this.bufferId = null;
    this.texture = null;

    // 4 vertices * 8 verrtex attributes per vertex * the number of tiles + the number of degenerate triangles
    this.vbo = new Float32Array(4 * 8 * this.tileOpts.rowLength * this.tileOpts.columnLength + (this.tileOpts.columnLength * 2 * 8));

    let index = 0;
    const originalX = x;

    for (let i = 0; i < this.tileOpts.columnLength; i++) {
      if (i !== 0) {
        x = originalX;
        y += this.tileOpts.height;
      }

      for (let j = 0; j < this.tileOpts.rowLength; j++) {
        // Vertex upper left
        this.vbo[ index + 0 ] = x; // x
        this.vbo[ index + 1 ] = y; // y
        this.vbo[ index + 2 ] = 0; // tx
        this.vbo[ index + 3 ] = 0; // ty
        this.vbo[ index + 4 ] = 0; // r
        this.vbo[ index + 5 ] = 0; // g
        this.vbo[ index + 6 ] = 0; // b
        this.vbo[ index + 7 ] = 0; // a

        // Vertex upper right
        this.vbo[ index + 8 ] = x + this.tileOpts.width;
        this.vbo[ index + 9 ] = y; // y
        this.vbo[ index + 10 ] = 0; // tx
        this.vbo[ index + 11 ] = 0; // ty
        this.vbo[ index + 12 ] = 0; // r
        this.vbo[ index + 13 ] = 0; // g
        this.vbo[ index + 14 ] = 0; // b
        this.vbo[ index + 15 ] = 0; // a

        // Vertex lower left
        this.vbo[ index + 16 ] = x; // x
        this.vbo[ index + 17 ] = y + this.tileOpts.height;
        this.vbo[ index + 18 ] = 0; // tx
        this.vbo[ index + 19 ] = 0; // ty
        this.vbo[ index + 20 ] = 0; // r
        this.vbo[ index + 21 ] = 0; // g
        this.vbo[ index + 22 ] = 0; // b
        this.vbo[ index + 23 ] = 0; // a

        // Vertex lower right
        this.vbo[ index + 24 ] = x + this.tileOpts.width;
        this.vbo[ index + 25 ] = y + this.tileOpts.height;
        this.vbo[ index + 26 ] = 0; // tx
        this.vbo[ index + 27 ] = 0; // ty
        this.vbo[ index + 28 ] = 0; // r
        this.vbo[ index + 29 ] = 0; // g
        this.vbo[ index + 30 ] = 0; // b
        this.vbo[ index + 31 ] = 0; // a

        index += 32;
        x += this.tileOpts.width;

        // degenerate triangle
        if (j + 1 >= this.tileOpts.rowLength) {
          for (let k = 0, l = 16; k < 16; k++, l--) {
            this.vbo[index + k] = this.vbo[index - l];
          }
          index += 16;
        }
      }
    }
  }

  public setTexture(texture: Texture): void {
    this.texture = texture;

    for (let i = 0; i < this.vbo.length; i += 32) {
      const tx = i + 2;
      const ty = i + 3;

      this.vbo[tx + 0] = 0.0;
      this.vbo[ty + 0] = 0.0;
      this.vbo[tx + 8] = 1.0; // texture.width();
      this.vbo[ty + 8] = 0.0;
      this.vbo[tx + 16] = 0.0;
      this.vbo[ty + 16] = 1.0; // texture.height();
      this.vbo[tx + 24] = 1.0; // texture.width();
      this.vbo[ty + 24] = 1.0; // texture.height();
    }
  }

  public setSpriteSheet(sheet: SpriteSheet): void {
    let tile: ITextureTile;
    let degenerateTri = 0;

    this.texture = sheet;
    for (let i = 0; i < this.tileOpts.rowLength * this.tileOpts.columnLength; i++) {
      // for every tile (32 byte offset) we need to check our sprite sheet to see if there is a texture thats needs to be drawn there
      tile = sheet.textureForIndex(i);

      if (i > 0 && i % this.tileOpts.rowLength === 0) {
        degenerateTri += 16;
      }

      if (tile.hasTexture) {
        // upper left vertex
        this.vbo[ (i * 32) + degenerateTri + 2 ] = tile.x;
        this.vbo[ (i * 32) + degenerateTri + 3 ] = tile.y;

        // upper right vertex
        this.vbo[ (i * 32) + degenerateTri + 10 ] = tile.x + tile.width;
        this.vbo[ (i * 32) + degenerateTri + 11 ] = tile.y;

        // lower left vertex
        this.vbo[ (i * 32) + degenerateTri + 18 ] = tile.x;
        this.vbo[ (i * 32) + degenerateTri + 19 ] = tile.y + tile.height;

        // lower right vertex
        this.vbo[ (i * 32) + degenerateTri + 26 ] = tile.x + tile.width;
        this.vbo[ (i * 32) + degenerateTri + 27 ] = tile.y + tile.height;
      }
    }
  }

  public setColor(r: number, g: number, b: number, a: number): void {
    for (let i = 0; i < this.vbo.length; i += 8) {
      this.vbo[i + 4] = r % 256;
      this.vbo[i + 5] = g % 256;
      this.vbo[i + 6] = b % 256;
      this.vbo[i + 7] = a % 256;
    }
  }

  public enableBufferData(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void {
    if (this.bufferId === null) {
      this.bufferId = gl.createBuffer();
    }

    if (this.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.ID());
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.vbo, gl.STATIC_DRAW);

    for (const [ attName, attValue ] of vertexAttributes) {
      gl.enableVertexAttribArray(attName.id as number);
      gl.vertexAttribPointer(
        attName.id as number,
        attValue.vertexAttribute.size,
        gl.FLOAT,
        attValue.vertexAttribute.normalized,
        attValue.vertexAttribute.stride,
        attValue.vertexAttribute.offset,
      );
    }
  }

  public disableBuffer(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    for (const [ attName, attValue ] of vertexAttributes) {
      gl.disableVertexAttribArray(attName.id as number);
    }
  }

  public verticeCount(): number {
    return this.vbo.length / 8;
  }

  public vertexAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      normalized: false,
      size: 2,
      offset: 0,
      stride: 32,
    };
  }

  public colorAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      normalized: false,
      size: 4,
      offset: 16,
      stride: 32,
    };
  }

  public textureAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      normalized: false,
      size: 2,
      offset: 8,
      stride: 32,
    };
  }
}

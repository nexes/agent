import { UUID } from '../agent';
import Texture, { Sprite } from '../texture';
import { IRenderable } from '../renderable';
import { IVertexAttribute, IAttributeValue } from '../shader';


export class Tile implements IRenderable {
  public readonly UUID: string;

  private vbo: Float32Array;
  private bufferId: WebGLBuffer;
  private texture: Texture;
  private spriteMap: Map<string, [ WebGLTexture, Sprite ]>;
  private activeSprite: string;
  private shouldAnimate: boolean;


  constructor(x: number, y: number, width: number, height: number) {
    this.UUID = UUID();
    this.spriteMap = new Map();
    this.activeSprite = '';
    this.vbo = new Float32Array(8 * 4); // 8 vertex attributes for 4 vertices
    this.bufferId = null;
    this.texture = null;
    this.shouldAnimate = true;

    this.vbo[ 0 ] = x;
    this.vbo[ 1 ] = y;
    this.vbo[ 2 ] = 0; // ts
    this.vbo[ 3 ] = 0; // tt
    this.vbo[ 4 ] = 0; // r
    this.vbo[ 5 ] = 0; // g
    this.vbo[ 6 ] = 0; // b
    this.vbo[ 7 ] = 0; // a

    this.vbo[ 8 ] = x + width;
    this.vbo[ 9 ] = y;
    this.vbo[ 10 ] = 0; // ts
    this.vbo[ 11 ] = 0; // tt
    this.vbo[ 12 ] = 0; // r
    this.vbo[ 13 ] = 0; // g
    this.vbo[ 14 ] = 0; // b
    this.vbo[ 15 ] = 0; // a

    this.vbo[ 16 ] = x;
    this.vbo[ 17 ] = y + height;
    this.vbo[ 18 ] = 0; // ts
    this.vbo[ 19 ] = 0; // tt
    this.vbo[ 20 ] = 0; // r
    this.vbo[ 21 ] = 0; // g
    this.vbo[ 22 ] = 0; // b
    this.vbo[ 23 ] = 0; // a

    this.vbo[ 24 ] = x + width;
    this.vbo[ 25 ] = y + height;
    this.vbo[ 26 ] = 0; // ts
    this.vbo[ 27 ] = 0; // tt
    this.vbo[ 28 ] = 0; // r
    this.vbo[ 29 ] = 0; // g
    this.vbo[ 30 ] = 0; // b
    this.vbo[ 31 ] = 0; // a
  }

  public verticeCount(): number {
    return 4;
  }

  public setColor(r: number, g: number, b: number, a: number): void {
    for (let i = 4; i < this.vbo.length; i += 4) {
      this.vbo[i++] = r % 256;
      this.vbo[i++] = g % 256;
      this.vbo[i++] = b % 256;
      this.vbo[i++] = a % 256;
    }
  }

  public setTexture(texture: Texture): void {
    this.texture = texture;

    this.vbo[ 2 ] = 0;
    this.vbo[ 3 ] = 0;
    this.vbo[ 10 ] = 1.0;
    this.vbo[ 11 ] = 0;
    this.vbo[ 18 ] = 0;
    this.vbo[ 19 ] = 1.0;
    this.vbo[ 26 ] = 1.0;
    this.vbo[ 27 ] = 1.0;
  }

  /**
   * set the sprite to the renderable. The sprite object should come from the Spritesheet.generateSprite
   * @param {string}  title the identifying string for the sprite
   * @param {WebGLTexture}  texture the texture ID from the spritesheet
   * @param {Sprite}  sheet the sprite to use for the renderable
   */
  public setSprite(title: string, texture: WebGLTexture, sprite: Sprite): void {
    this.spriteMap.set(title, [ texture, sprite ]);
    this.activeSprite = title;

    const framePos = sprite.getFrameAtIndex(0);

    this.vbo[ 2 ] = framePos.x;
    this.vbo[ 3 ] = framePos.y;
    this.vbo[ 10 ] = framePos.x + framePos.width;
    this.vbo[ 11 ] = framePos.y;
    this.vbo[ 18 ] = framePos.x;
    this.vbo[ 19 ] = framePos.y + framePos.height;
    this.vbo[ 26 ] = framePos.x + framePos.width;
    this.vbo[ 27 ] = framePos.y + framePos.height;
  }

  public setActiveSprite(name: string): boolean {
    if (this.spriteMap.has(name)) {
      this.activeSprite = name;
      return true;
    }
    return false;
  }

  public animateSprite(animate: boolean): void {
    this.shouldAnimate = animate;
  }

  // tiles have a default buffer layout, so we can hard code
  public vertexAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      size: 2,
      normalized: false,
      stride: 32,
      offset: 0,
    };
  }

  // tiles have a default buffer layout, so we can hard code
  public colorAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      size: 4,
      normalized: false,
      stride: 32,
      offset: 16,
    };
  }

  // tiles have a default buffer layout, so we can hard code
  public textureAttributes(): IVertexAttribute {
    return {
      UUID: this.UUID,
      size: 2,
      normalized: false,
      stride: 32,
      offset: 8,
    };
  }

  public enableBufferData(gl: WebGLRenderingContext, vertexAttributes: IAttributeValue[]): void {
    if (this.bufferId === null) {
      this.bufferId = gl.createBuffer();
    }

    // update here with any vertex changes, ie. scale, transform etc
    if (this.spriteMap.size > 0) {
      const sprite = this.spriteMap.get(this.activeSprite);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, sprite[0]);

      if (this.shouldAnimate) {
        this.updateSprite(sprite[1]);
      }
    }

    if (this.texture) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture.ID());
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, this.vbo, gl.STATIC_DRAW);

    for (const attribute of vertexAttributes) {
      gl.enableVertexAttribArray(attribute.location);
      gl.vertexAttribPointer(
        attribute.location,
        attribute.data.size,
        gl.FLOAT,
        attribute.data.normalized,
        attribute.data.stride,
        attribute.data.offset,
      );
    }
  }

  public disableBuffer(gl: WebGLRenderingContext, vertexAttributes: IAttributeValue[]): void {
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    for (const attribute of vertexAttributes) {
      gl.disableVertexAttribArray(attribute.location);
    }
  }

  private updateSprite(sprite: Sprite): void {
    const rect = sprite.getNextFrame();

    this.vbo[ 2 ] = rect.x;
    this.vbo[ 3 ] = rect.y;
    this.vbo[ 10 ] = rect.x + rect.width;
    this.vbo[ 11 ] = rect.y;
    this.vbo[ 18 ] = rect.x;
    this.vbo[ 19 ] = rect.y + rect.height;
    this.vbo[ 26 ] = rect.x + rect.width;
    this.vbo[ 27 ] = rect.y + rect.height;
  }
}

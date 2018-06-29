import { UUID } from '../agent';
import Texture from '../texture';
import { IRenderable } from '../renderable';
import { IVertexAttribute, IShaderAttributeName, IAttributeValue } from '../shader';


export class Square implements IRenderable {
	public readonly UUID: string;

	private vbo: Float32Array;
	private bufferId: WebGLBuffer;
	private texture: Texture;


	constructor(x: number, y: number, width: number, height: number) {
		this.UUID = UUID();
		this.vbo = new Float32Array(8 * 4); // 8 vertex attributes for 4 vertices
		this.bufferId = null;
		this.texture = null;

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

	// squares have a default buffer layout, so we can hard code
	public vertexAttributes(): IVertexAttribute {
		return {
			UUID: this.UUID,
			size: 2,
			normalized: false,
			stride: 32,
			offset: 0,
		};
	}

	// squares have a default buffer layout, so we can hard code
	public colorAttributes(): IVertexAttribute {
		return {
			UUID: this.UUID,
			size: 4,
			normalized: false,
			stride: 32,
			offset: 16,
		};
	}

	// squares have a default buffer layout, so we can hard code
	public textureAttributes(): IVertexAttribute {
		return {
			UUID: this.UUID,
			size: 2,
			normalized: false,
			stride: 32,
			offset: 8,
		};
	}

	public enableBufferData(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void {
		if (this.bufferId === null) {
			this.bufferId = gl.createBuffer();
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
		gl.bufferData(gl.ARRAY_BUFFER, this.vbo, gl.STATIC_DRAW);

		for (const [ attName, attData ] of vertexAttributes) {
			gl.enableVertexAttribArray(attName.id as number);
			gl.vertexAttribPointer(
				attName.id as number,
				attData.vertexAttribute.size,
				gl.FLOAT,
				attData.vertexAttribute.normalized,
				attData.vertexAttribute.stride,
				attData.vertexAttribute.offset,
			);
		}

		if (this.texture) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, this.texture.ID());
		}
	}

	public disableBuffer(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void {
		gl.bindBuffer(gl.ARRAY_BUFFER, null);

		for (const [ attName, attData ] of vertexAttributes) {
			gl.disableVertexAttribArray(attName.id as number);
		}
	}
}

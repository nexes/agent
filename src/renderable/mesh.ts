import { Texture } from '../engine';
import { IRenderable, ITileOptions, UUID_MAX } from '../renderable';
import { IVertexAttribute, IShaderAttributeName, IAttributeValue } from '../shader';


export class Mesh implements IRenderable {
	public readonly UUID: number;

	private tileCountX: number;
	private tileCountY: number;
	private vbo: Float32Array;
	private bufferId: WebGLBuffer;
	private texture: Texture;

	/**
	 * Create a 2D mesh (grid) object.
	 */
	constructor(x: number, y: number, width: number, height: number, tileOptions: ITileOptions) {
		// TODO: do a proper uuid
		this.UUID = Math.floor(Math.random() * UUID_MAX);
		this.tileCountX = Math.floor(width / tileOptions.singleTileWidth);
		this.tileCountY = Math.floor(height / tileOptions.singleTileHeight);
		this.bufferId = null;
		this.texture = null;

		// 4 vertices * 8 verrtex attributes per vertex * the number of tiles + the number of degenerate triangles
		this.vbo = new Float32Array(4 * 8 * this.tileCountX * this.tileCountY + (this.tileCountY * 2 * 8));

		let index = 0;
		const originalX = x;
		for (let i = 0; i < this.tileCountY; i++) {
			if (i !== 0) {
				x = originalX;
				y += tileOptions.singleTileHeight;
			}

			for (let j = 0; j < this.tileCountX; j++) {
				// Vertext upper left
				this.vbo[ index + 0 ] = x; // x
				this.vbo[ index + 1 ] = y; // y
				this.vbo[ index + 2 ] = 0; // tx
				this.vbo[ index + 3 ] = 0; // ty
				this.vbo[ index + 4 ] = 0; // r
				this.vbo[ index + 5 ] = 1; // g
				this.vbo[ index + 6 ] = 0; // b
				this.vbo[ index + 7 ] = 1; // a

				// Vertext upper right
				this.vbo[ index + 8 ] = x + tileOptions.singleTileWidth;
				this.vbo[ index + 9 ] = y; // y
				this.vbo[ index + 10 ] = 0; // tx
				this.vbo[ index + 11 ] = 0; // ty
				this.vbo[ index + 12 ] = 0; // r
				this.vbo[ index + 13 ] = 1; // g
				this.vbo[ index + 14 ] = 0; // b
				this.vbo[ index + 15 ] = 1; // a

				// Vertext lower left
				this.vbo[ index + 16 ] = x; // x
				this.vbo[ index + 17 ] = y + tileOptions.singleTileHeight;
				this.vbo[ index + 18 ] = 0; // tx
				this.vbo[ index + 19 ] = 0; // ty
				this.vbo[ index + 20 ] = 0; // r
				this.vbo[ index + 21 ] = 1; // g
				this.vbo[ index + 22 ] = 0; // b
				this.vbo[ index + 23 ] = 1; // a

				// Vertext lower right
				this.vbo[ index + 24 ] = x + tileOptions.singleTileWidth;
				this.vbo[ index + 25 ] = y + tileOptions.singleTileHeight;
				this.vbo[ index + 26 ] = 0; // tx
				this.vbo[ index + 27 ] = 0; // ty
				this.vbo[ index + 28 ] = 0; // r
				this.vbo[ index + 29 ] = 1; // g
				this.vbo[ index + 30 ] = 0; // b
				this.vbo[ index + 31 ] = 1; // a

				index += 32;
				x += tileOptions.singleTileWidth;

				// degenerate triangle
				if (j + 1 >= this.tileCountX) {
					this.vbo[ index + 0 ] = this.vbo[ index - 16];
					this.vbo[ index + 1 ] = this.vbo[ index - 15];
					this.vbo[ index + 2 ] = this.vbo[ index - 14];
					this.vbo[ index + 3 ] = this.vbo[ index - 13];
					this.vbo[ index + 4 ] = this.vbo[ index - 12];
					this.vbo[ index + 5 ] = this.vbo[ index - 11];
					this.vbo[ index + 6 ] = this.vbo[ index - 10];
					this.vbo[ index + 7 ] = this.vbo[ index - 9];

					this.vbo[ index + 8 ] = this.vbo[ index - 8 ];
					this.vbo[ index + 9 ] = this.vbo[ index - 7 ];
					this.vbo[ index + 10 ] = this.vbo[ index - 6 ];
					this.vbo[ index + 11 ] = this.vbo[ index - 5 ];
					this.vbo[ index + 12 ] = this.vbo[ index - 4 ];
					this.vbo[ index + 13 ] = this.vbo[ index - 3 ];
					this.vbo[ index + 14 ] = this.vbo[ index - 2 ];
					this.vbo[ index + 15 ] = this.vbo[ index - 1 ];

					index += 16;
				}
			}
		}
	}

	public setTexture(texture: Texture): void {
		this.texture = texture;
		throw new Error('Method not implemented.');
	}

	public setColor(r: number, g: number, b: number, a: number): void {
		throw new Error('Method not implemented.');
	}

	public enableBufferData(gl: WebGLRenderingContext, vertexAttributes: Map<IShaderAttributeName, IAttributeValue>): void {
		if (this.bufferId === null) {
			this.bufferId = gl.createBuffer();
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

			if (this.texture) {
				gl.activeTexture(gl.TEXTURE0);
				gl.bindTexture(gl.TEXTURE_2D, this.texture.ID());
			}
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

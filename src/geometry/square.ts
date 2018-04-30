import { IRenderable, Texture } from '../renderer';
// import { IAttributeValue,	IAttributeName, IVertexAttribute } from '../shader';
import { IVertexAttribute } from '../shader';


// interface IAttributeName {
// 	name: string;
// 	id: number;
// }

const UUIDMAX = 10000; // just an abritrary max for right now


export class Square implements IRenderable {
	readonly UUID: number;

	private vbo: Float32Array;
	private bufferId: WebGLBuffer;
	private texture: Texture;
	// private attribData: Map<IAttributeName, IAttributeValue>;


	constructor(x: number, y: number, width: number, height: number) {
		this.UUID = Math.floor(Math.random() * UUIDMAX); // TODO design a better UUID system where we can check for collisions
		this.vbo = new Float32Array(8 * 4); // 8 vertex attributes for 4 vertices
		// this.attribData = new Map();
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

		// TODO
		this.vbo[ 2 ] = 0;
		this.vbo[ 3 ] = 0;
		this.vbo[ 10 ] = 1.0;
		this.vbo[ 11 ] = 0;
		this.vbo[ 18 ] = 0;
		this.vbo[ 19 ] = 1.0;
		this.vbo[ 26 ] = 1.0;
		this.vbo[ 27 ] = 1.0;

		// for (let i = 2; i < this.vbo.length; i += 6) {
		// 	this.vbo[i++] = 1;
		// 	this.vbo[i++] = 1;
		// }
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

	public textureAttributes(): IVertexAttribute {
		return {
			UUID: this.UUID,
			size: 2,
			normalized: false,
			stride: 32,
			offset: 8,
		};
	}

	public enableBuffer(gl: WebGLRenderingContext, program: WebGLProgram): void {
		if (this.bufferId === null) {
			this.bufferId = gl.createBuffer();
		}
		// bind our buffer
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
		gl.bufferData(gl.ARRAY_BUFFER, this.vbo, gl.STATIC_DRAW);

		// bind our texture
		if (this.texture) {
			gl.activeTexture(gl.TEXTURE0); // should this be here?
			gl.bindTexture(gl.TEXTURE_2D, this.texture.ID());
		}
	}
}

import { IRenderable } from '../renderer';
import { IAttributeValue, IVertexAttribute } from '../shader';


interface IAttributeName {
	name: string;
	id: number;
}

export class Square implements IRenderable {
	private vbo: Float32Array;
	private bufferId: WebGLBuffer;
	private attribData: Map<IAttributeName, IAttributeValue>;


	constructor(x: number, y: number, width: number, height: number) {
		this.bufferId = null;
		this.vbo = new Float32Array(8 * 4); // 8 vertex attributes for 4 vertices
		this.attribData = new Map();

		this.vbo[ 0 ] = x;
		this.vbo[ 1 ] = y;
		this.vbo[ 2 ] = 0; // tx
		this.vbo[ 3 ] = 0; // ty
		this.vbo[ 4 ] = 0; // r
		this.vbo[ 5 ] = 0; // g
		this.vbo[ 6 ] = 0; // b
		this.vbo[ 7 ] = 0; // a

		this.vbo[ 8 ] = x + width;
		this.vbo[ 9 ] = y;
		this.vbo[ 10 ] = 0; // tx
		this.vbo[ 11 ] = 0; // ty
		this.vbo[ 12 ] = 0; // r
		this.vbo[ 13 ] = 0; // g
		this.vbo[ 14 ] = 0; // b
		this.vbo[ 15 ] = 0; // a

		this.vbo[ 16 ] = x;
		this.vbo[ 17 ] = y + height;
		this.vbo[ 18 ] = 0; // tx
		this.vbo[ 19 ] = 0; // ty
		this.vbo[ 20 ] = 0; // r
		this.vbo[ 21 ] = 0; // g
		this.vbo[ 22 ] = 0; // b
		this.vbo[ 23 ] = 0; // a

		this.vbo[ 24 ] = x + width;
		this.vbo[ 25 ] = y + height;
		this.vbo[ 26 ] = 0; // tx
		this.vbo[ 27 ] = 0; // ty
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

	public setTexture(): void {
		throw new Error('Method not implemented.');
	}

	// squares have a default buffer layout, so we can hard code
	public vertexAttributes(): IVertexAttribute {
		return {
			size: 2,
			normalized: false,
			stride: 32,
			offset: 0,
		};
	}

	// squares have a default buffer layout, so we can hard code
	public colorAttributes(): IVertexAttribute {
		return {
			size: 4,
			normalized: false,
			stride: 32,
			offset: 16,
		};
	}

	public textureAttributes(): IVertexAttribute {
		return {
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
	}
}

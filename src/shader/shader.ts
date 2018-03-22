import { Vector2, Vector3, Matrix4 } from '../math';


export enum ShaderType {
	Vertex,
	Fragment,
}

export interface IShaderAttrib {
	name: string;
	id: number | WebGLUniformLocation;
}

export interface IVertexAttribute {
	readonly size: number;
	readonly normalized: boolean;
	readonly stride: number;
	readonly offset: number;
}

interface IShaderData {
	id: WebGLShader;
	type: ShaderType;
	code: string;
	attributes: IShaderAttrib[];
	uniforms: IShaderAttrib[];
	varyings: IShaderAttrib[];
}

export class Shader {
	// key: shader name, value: shader data
	private shaderList: Map<string, IShaderData>;

	constructor() {
		this.shaderList = new Map<string, IShaderData>();
	}

	public setShaderData(gl: WebGLRenderingContext, program: WebGLProgram, name: string, type: ShaderType, code: string): void {
		const tempAttr: IShaderAttrib[] = [];
		const tempUniform: IShaderAttrib[] = [];
		const tempVarying: IShaderAttrib[] = [];

		const lines = code.split('\n');
		const id = this.compileSource(gl, program, type, code);

		for (const line of lines) {
			const endIndex = line.charAt(line.length - 1) === ';' ? line.length - 1 : line.length;
			const varName = line.substring(line.lastIndexOf(' ') + 1, endIndex);

			if (line.search(/^\s*(attribute)/gi) !== -1) {
				tempAttr.push({
					name: varName,
					id: gl.getAttribLocation(program, varName),
				});

			} else if (line.search(/^\s*(uniform)/gi) !== -1) {
				tempUniform.push({
					name: varName,
					id: gl.getUniformLocation(program, varName),
				});

			} else if (line.search(/^\s*(varying)/gi) !== -1) {
				tempVarying.push({
					name: varName,
					id: -1,
				});
			}
		}

		this.shaderList.set(name, {
			id,
			type,
			code,
			attributes: tempAttr,
			uniforms: tempUniform,
			varyings: tempVarying,
		});
	}

	public getId(shaderName: string): WebGLShader {
		const shader = this.shaderList.get(shaderName);
		return shader.id;
	}

	public getAttributes(shaderName: string): IShaderAttrib[] {
		const shader = this.shaderList.get(shaderName);
		return shader.attributes;
	}

	public getUniforms(shaderName: string): IShaderAttrib[] {
		const shader = this.shaderList.get(shaderName);
		return shader.uniforms;
	}

	public getVaryings(shaderName: string): IShaderAttrib[] {
		const shader = this.shaderList.get(shaderName);
		return shader.varyings;
	}

	public setVertexAttrib(gl: WebGLRenderingContext, shaderName: string, attName: string, attribute: IVertexAttribute): void {
		const shader = this.shaderList.get(shaderName);

		if (shader === undefined) {
			// write a dispatch system for errors
			throw new Error(`setVertexAttrib: Shader ${shaderName} was not found.`);
		}

		const attrs = shader.attributes;
		const aLoc = attrs.filter((attrib) => attrib.name === attName);

		if (aLoc.length === 0) {
			// write a dispatch system for errors
			throw new ReferenceError(`setVertexAttrib: ${attName} was not found`);
		}

		// I'm not nuts about this cast
		gl.enableVertexAttribArray(aLoc[ 0 ].id as number);
		gl.vertexAttribPointer(aLoc[ 0 ].id as number, attribute.size, gl.FLOAT, attribute.normalized, attribute.stride, attribute.offset);
	}

	public setUniform(gl: WebGLRenderingContext, shaderName: string, uniformName: string, data: Matrix4 | Float32Array | number ) {
		const shader = this.shaderList.get(shaderName);

		if (shader === undefined) {
			// should we throw, or setup a dispatch system?
			throw new Error(`setUniform: Shader ${shaderName} was not found.`);
		}

		const uniforms = shader.uniforms;
		const uLoc = uniforms.filter((uniform) => uniform.name === uniformName);

		if (uLoc.length === 0) {
			throw new ReferenceError(`setUniform: ${uniformName} was not found`);
		}

		if (data instanceof Matrix4) {
			gl.uniformMatrix4fv(uLoc[ 0 ].id, false, data.flatten());

		} else if (data instanceof Float32Array) {
			const len = data.length;
			switch (len) {
				case 2:
					gl.uniform2fv(uLoc[ 0 ].id, data);

				case 3:
					gl.uniform3fv(uLoc[ 0 ].id, data);

				case 4:
					gl.uniform4fv(uLoc[ 0 ].id, data);
			}

		} else if (typeof data === 'number') {
			gl.uniform1f(uLoc[ 0 ].id, data);

		} else {
			// should we throw, or setup a dispatch system?
			throw new TypeError('setUniform: data passed is not a valid type');
		}
	}

	private compileSource(gl: WebGLRenderingContext, program: WebGLProgram, type: ShaderType, source: string): WebGLShader {
		const shaderID = gl.createShader(type === ShaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

		gl.shaderSource(shaderID, source);
		gl.compileShader(shaderID);
		if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
			// should we throw, or setup a dispatch system?
			console.log(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(shaderID)}`);
		}

		gl.attachShader(program, shaderID);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(program)}`);
		}

		return shaderID;
	}
}

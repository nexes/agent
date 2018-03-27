import { IVertexAttribute, IShaderAttrib, ShaderType } from '.';
import Matrix4, { Vector2, Vector3 } from '../math';


interface IShaderData {
	id: WebGLShader;
	type: ShaderType;
	code: string;
	attributes: IShaderAttrib[];
	uniforms: IShaderAttrib[];
	varyings: IShaderAttrib[];
}

export class Shader {
	private shaderData: IShaderData;
	private vertAttributes: Map<string, IVertexAttribute>;

	constructor() {
		this.shaderData = null;
		this.vertAttributes = new Map();
	}

	public setShaderData(gl: WebGLRenderingContext, type: ShaderType, code: string): void {
		const tempAttr: IShaderAttrib[] = [];
		const tempUniform: IShaderAttrib[] = [];
		const tempVarying: IShaderAttrib[] = [];

		const lines = code.split('\n');
		const id = this.compileSource(gl, type, code);

		for (const line of lines) {
			const endIndex = line.charAt(line.length - 1) === ';' ? line.length - 1 : line.length;
			const varName = line.substring(line.lastIndexOf(' ') + 1, endIndex);

			if (line.search(/^\s*(attribute)/gi) !== -1) {
				tempAttr.push({
					name: varName,
					id: -1,
				});

			} else if (line.search(/^\s*(uniform)/gi) !== -1) {
				tempUniform.push({
					name: varName,
					id: -1,
				});

			} else if (line.search(/^\s*(varying)/gi) !== -1) {
				tempVarying.push({
					name: varName,
					id: 0,
				});
			}
		}

		this.shaderData = {
			id,
			type,
			code,
			attributes: tempAttr,
			uniforms: tempUniform,
			varyings: tempVarying,
		};
	}

	public get ID(): WebGLShader {
		return this.shaderData.id;
	}

	public get Attributes(): IShaderAttrib[] {
		return this.shaderData.attributes;
	}

	public get Uniforms(): IShaderAttrib[] {
		return this.shaderData.uniforms;
	}

	public get Varyings(): IShaderAttrib[] {
		return this.shaderData.varyings;
	}

	public setUniform(gl: WebGLRenderingContext, uniformName: string, data: Matrix4 | Float32Array | number ) {
		const uniforms = this.shaderData.uniforms;
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

	private compileSource(gl: WebGLRenderingContext, type: ShaderType, source: string): WebGLShader {
		const shaderID = gl.createShader(type);

		gl.shaderSource(shaderID, source);
		gl.compileShader(shaderID);
		if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
			// should we throw, or setup a dispatch system?
			console.log(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(shaderID)}`);
		}

		return shaderID;
	}
}

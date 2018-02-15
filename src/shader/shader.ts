export enum ShaderType {
	Vertex,
	Fragment,
}

export interface IShaderAttrib {
	name: string;
	id: GLint | WebGLUniformLocation;
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

		const id = this.compileSource(gl, type, code);
		const lines = code.split('\n');

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

	public getId(name: string): WebGLShader {
		const shader = this.shaderList.get(name);
		return shader.id;
	}

	public getAttributes(name: string): IShaderAttrib[] {
		const shader = this.shaderList.get(name);
		return shader.attributes;
	}

	public getUniforms(name: string): IShaderAttrib[] {
		const shader = this.shaderList.get(name);
		return shader.uniforms;
	}

	public getVaryings(name: string): IShaderAttrib[] {
		const shader = this.shaderList.get(name);
		return shader.varyings;
	}

	private compileSource(gl: WebGLRenderingContext, type: ShaderType, source: string): WebGLShader {
		const tempId = gl.createShader(type === ShaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

		gl.shaderSource(tempId, source);
		gl.compileShader(tempId);

		if (!gl.getShaderParameter(tempId, gl.COMPILE_STATUS)) {
			// should we throw, or setup a dispatch system?
			console.log(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(tempId)}`);
		}

		return tempId;
	}
}

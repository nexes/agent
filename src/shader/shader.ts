export enum shaderType {
	Vertex,
	Fragment,
}

interface shaderData {
	id: WebGLShader
	type: shaderType
	attributes: string[]
	uniforms: string[]
	varyings: string[]
}

export class Shader {
	private shaderList: Map<string, shaderData>;

	constructor() {
		this.shaderList = new Map<string, shaderData>();
	}

	public setShaderData(gl: WebGLRenderingContext, name: string, type: shaderType, code: string): void {
		const tempAttr = [];
		const tempUniform = [];
		const tempVarying = [];
		const lines = code.split('\n');

		for (const line of lines) {
			const endIndex = line.charAt(line.length - 1) === ';' ? line.length - 1 : line.length;
			const varName = line.substring(line.lastIndexOf(' ') + 1, endIndex);

			if (line.search(/^\s*(attribute)/gi) !== -1) {
				tempAttr.push(varName);

			} else if (line.search(/^\s*(uniform)/gi) !== -1) {
				tempUniform.push(varName);

			} else if (line.search(/^\s*(varying)/gi) !== -1) {
				tempVarying.push(varName);
			}
		}

		const id = this.compileSource(gl, type, code);

		this.shaderList.set(name, {
			id,
			type,
			attributes: tempAttr,
			uniforms: tempUniform,
			varyings: tempVarying
		});
	}

	public getAttributes(name: string): string[] {
		const shader = this.shaderList.get(name);
		return shader.attributes;
	}

	public getUniforms(name: string): string[] {
		const shader = this.shaderList.get(name);
		return shader.uniforms;
	}

	public getVaryings(name: string): string[] {
		const shader = this.shaderList.get(name);
		return shader.varyings;
	}

	private compileSource(gl: WebGLRenderingContext, type: shaderType, source: string): WebGLShader {
		const tempId = gl.createShader(type === shaderType.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);

		gl.shaderSource(tempId, source);
		gl.compileShader(tempId);

		if (!gl.getShaderParameter(tempId, gl.COMPILE_STATUS)) {
			// should we throw, or setup a dispatch system?
			console.log(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(tempId)}`);
		}

		return tempId;
	}
}

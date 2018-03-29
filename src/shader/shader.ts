import { IVertexAttribute, IShaderAttrib, ShaderType, IUniformAttribute } from '.';
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
	private uniformData: Map<IShaderAttrib, IUniformAttribute>;

	constructor() {
		this.shaderData = null;
		this.uniformData = new Map();
	}

	public setShaderSource(gl: WebGLRenderingContext, type: ShaderType, code: string): void {
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
					id: -1,
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

	public setUniformDataFor(uniformName: string, uniformData: IUniformAttribute): void {
		const uniformLoc = this.shaderData.uniforms.filter((uniform) => uniform.name === uniformName);

		if (uniformLoc.length === 0) {
			throw new ReferenceError(`setUniformDataFor: ${uniformName} was not found`);
		}

		this.uniformData.set({ name: uniformName, id: -1 }, uniformData);
	}

	public setUniformIDFor(uniformName: string, uniformID: WebGLUniformLocation): void {
		for (const [ name, data ] of this.uniformData) {
			if (name.name === uniformName) {
				this.uniformData.delete(name);
				this.uniformData.set({ name: uniformName, id: uniformID }, data);
				break;
			}
		}
	}

	public getUniformData(): Map<IShaderAttrib, IUniformAttribute> {
		return this.uniformData;
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

import { ShaderType, IAttributeValue, IVertexAttribute, IShaderAttributeName, IUniformValue } from '.';
import { Matrix4,	Vector2,	Vector3 } from '../math';


interface IShaderData {
	id: WebGLShader;
	type: ShaderType;
	code: string;
	attributes: IShaderAttributeName[];
	uniforms: IShaderAttributeName[];
	varyings: IShaderAttributeName[];
}

export class Shader {
	private shaderData: IShaderData;
	private uniformData: Map<IShaderAttributeName, IUniformValue>;
	private attributeData: Map<IShaderAttributeName, IAttributeValue>;

	constructor() {
		this.shaderData = null;
		this.uniformData = new Map();
		this.attributeData = new Map();
	}

	public setShaderSource(gl: WebGLRenderingContext, type: ShaderType, code: string): void {
		const tempAttr: IShaderAttributeName[] = [];
		const tempUniform: IShaderAttributeName[] = [];
		const tempVarying: IShaderAttributeName[] = [];

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

	public get Attributes(): Map<IShaderAttributeName, IAttributeValue> {
		return this.attributeData;
	}

	public get Uniforms(): Map<IShaderAttributeName, IUniformValue> {
		return this.uniformData;
	}

	public get Varyings(): IShaderAttributeName[] {
		return this.shaderData.varyings;
	}

	public setAttributeDataFor(attName: string, attribute: IAttributeValue): void
	public setAttributeDataFor(attName: string, attribute: IAttributeValue[]): void
	public setAttributeDataFor(attName: string, attribute: any): void {
		const attLocation = this.shaderData.attributes.filter((value) => value.name === attName);

		if (attLocation.length === 0) {
			throw new ReferenceError(`setAttributeDataFor: ${attName} was not found`);
		}

		if (Array.isArray(attribute)) {
			for (const attr of attribute) {
				this.attributeData.set({ name: attName, id: attLocation[ 0 ].id }, attr);
			}

		} else {
			this.attributeData.set({ name: attName, id: attLocation[ 0 ].id }, attribute);
		}
	}

	public setAttributeIDFor(attributeName: string, attributeID: number): void {
		for (const [ name, data ] of this.attributeData) {
			if (name.name === attributeName) {
				this.attributeData.delete(name);
				this.attributeData.set({ name: attributeName, id: attributeID }, data);
				break;
			}
		}
	}

	public setUniformDataFor(uniformName: string, uniformData: IUniformValue): void {
		const uniformLoc = this.shaderData.uniforms.filter((uniform) => uniform.name === uniformName);

		if (uniformLoc.length === 0) {
			throw new ReferenceError(`setUniformDataFor: ${uniformName} was not found`);
		}

		this.uniformData.set({ name: uniformName, id: uniformLoc[ 0 ].id }, uniformData);
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

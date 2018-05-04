import { ShaderType, IAttributeValue, IVertexAttribute, IShaderAttributeName, IUniformValue } from '.';
import { Matrix4,	Vector2,	Vector3 } from '../math';


interface IShaderSourceData {
	id: WebGLShader;
	type: ShaderType;
	code: string;
	attributesVars: string[];
	uniformsVars: string[];
	varyingsVars: string[];
}

export class Shader {
	private glCtx: WebGLRenderingContext;
	private programID: WebGLProgram;
	private shaderSourceData: IShaderSourceData;
	private uniforms: Map<IShaderAttributeName, IUniformValue>;
	private vertAttributes: Map<IShaderAttributeName, IAttributeValue>;
	private generalAttributes: Map<IShaderAttributeName, IAttributeValue>;

	constructor(gl: WebGLRenderingContext) {
		this.glCtx = gl;
		this.programID = null;
		this.shaderSourceData = null;
		this.uniforms = new Map();
		this.vertAttributes = new Map();
		this.generalAttributes = new Map();
	}

	public setShaderSource(programID: WebGLProgram, type: ShaderType, code: string): void {
		const tempAttr: string[] = [];
		const tempUniform: string[] = [];
		const tempVarying: string[] = [];

		const lines = code.split('\n');
		const id = this.compileShaderSource(type, code);

		if (!this.programID) {
			this.programID = programID;
		}

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

		this.glCtx.attachShader(this.programID, id);
		this.glCtx.linkProgram(this.programID);

		this.shaderSourceData = {
			id,
			type,
			code,
			attributesVars: tempAttr,
			uniformsVars: tempUniform,
			varyingsVars: tempVarying,
		};
	}

	public get ID(): WebGLShader {
		return this.shaderSourceData.id;
	}

	public vertexAttributes(renderableID: number): Map<IShaderAttributeName, IAttributeValue> {
		const attr = new Map<IShaderAttributeName, IAttributeValue>();

		for (const [ key, value ] of this.vertAttributes) {
			if (value.vertexAttribute.UUID === renderableID) {
				attr.set(key, value);
			}
		}
		return attr;
	}

	public shaderAttributes(): Map<IShaderAttributeName, IAttributeValue> {
		return this.generalAttributes;
	}

	public shaderUniforms(): Map<IShaderAttributeName, IUniformValue> {
		return this.uniforms;
	}

	public setAttributeDataFor(attName: string, attribute: IAttributeValue | IAttributeValue[]): void {
		const gl = this.glCtx;
		const attLocation = this.shaderSourceData.attributesVars.filter((value) => value === attName);

		if (attLocation.length === 0) {
			throw new ReferenceError(`setAttributeDataFor: ${attName} was not found`);
		}

		if (Array.isArray(attribute)) {
			for (const attr of attribute) {
				// TODO check if we already have the location
				const locID = gl.getAttribLocation(this.programID, attName);

				if (attr.vertexAttribute) {
					this.vertAttributes.set({ name: attName, id: locID }, attr);

				} else if (attr.attributeValue) {
					this.generalAttributes.set({ name: attName, id: locID }, attr);
				}
			}

		} else {
			// TODO check if we already have the location
			const locID = gl.getAttribLocation(this.programID, attName);
			if (attribute.vertexAttribute) {
				this.vertAttributes.set({ name: attName, id: locID }, attribute);

			} else if (attribute.attributeValue) {
				this.generalAttributes.set({ name: attName, id: locID }, attribute);
			}
		}
	}

	public setUniformDataFor(uniformName: string, uniformData: IUniformValue): void {
		const uniformLoc = this.shaderSourceData.uniformsVars.filter((uniform) => uniform === uniformName);

		if (uniformLoc.length === 0) {
			throw new ReferenceError(`setUniformDataFor: ${uniformName} was not found`);
		}

		this.glCtx.useProgram(this.programID);

		if (!this.glCtx.getProgramParameter(this.programID, this.glCtx.LINK_STATUS)) {
			const errMsg = this.glCtx.getProgramInfoLog(this.programID);

			console.log(`Error LINK_STATUS program Id ${errMsg}`);
			throw new ReferenceError(`LINK_STATUS error {errMsg}`);
		}

		// TODO check if we already have the location
		const locID = this.glCtx.getUniformLocation(this.programID, uniformName);

		if (uniformData.dataMatrix) {
			this.glCtx.uniformMatrix4fv(locID, false, uniformData.dataMatrix.flatten());

		} else if (uniformData.dataValue) {
			const len = uniformData.dataValue.length;

			switch (len) {
				case 1:
					this.glCtx.uniform1fv(locID, uniformData.dataValue);
					break;
				case 2:
					this.glCtx.uniform2fv(locID, uniformData.dataValue);
					break;
				case 3:
					this.glCtx.uniform3fv(locID, uniformData.dataValue);
					break;
				case 4:
					this.glCtx.uniform4fv(locID, uniformData.dataValue);
					break;
			}
		}

		this.uniforms.set({ name: uniformName, id: locID }, uniformData);
	}

	private compileShaderSource(type: ShaderType, source: string): WebGLShader {
		const gl = this.glCtx;
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

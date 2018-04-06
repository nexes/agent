import Shader, { ShaderType } from '../shader';
import { IRenderable } from '../renderer';
import { ICamera } from '../camera';


export class Scene {
	private camera: ICamera;
	private renderables: IRenderable[];
	private shaders: Map<ShaderType, Shader>;
	private programId: WebGLProgram;
	private programLinked: boolean;

	constructor() {
		this.shaders = new Map<ShaderType, Shader>();
		this.renderables = [];
		this.camera = null;
		this.programId = null;
		this.programLinked = false;
	}

	public addDrawable(...item: IRenderable[]): void {
		this.renderables.push(...item);
	}

	public addCamera(camera: ICamera): void {
		this.camera = camera;
	}

	public addShader(gl: WebGLRenderingContext, type: ShaderType, data: string): void {
		const newShader = new Shader();

		if (this.programId === null) {
			this.programId = gl.createProgram();
		}

		newShader.setShaderSource(gl, type, data);
		gl.attachShader(this.programId, newShader.ID);

		this.shaders.set(type, newShader);
	}

	public shader(shader: ShaderType): Shader {
		if (!this.shaders.has(shader)) {
			throw new Error(`Scene does not have shader type ${shader} assigned`);
		}
		return this.shaders.get(shader);
	}

	public render(gl: WebGLRenderingContext) {
		this.enableUniforms(gl);

		// TODO
		for (const gObject of this.renderables) {
			gObject.enableBuffer(gl, this.programId);
			this.enableAttributes(gl);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, gObject.verticeCount());
		}
	}

	private enableAttributes(gl: WebGLRenderingContext): void {
		for (const shader of this.shaders.values()) {
			const attributes = shader.Attributes;

			for (const [ attName, attData ] of attributes) {
				if (attName.id === -1) {
					const newID = gl.getAttribLocation(this.programId, attName.name);
					attName.id = newID;

					shader.setAttributeIDFor(attName.name, newID);
				}
				gl.enableVertexAttribArray(attName.id as number);

				if (attData.vertexAttribute) {
					gl.vertexAttribPointer(
						attName.id as number,
						attData.vertexAttribute.size,
						gl.FLOAT,
						attData.vertexAttribute.normalized,
						attData.vertexAttribute.stride,
						attData.vertexAttribute.offset);

				} else if (attData.attributeValue) {
					// TODO
				}
			}
		}
	}

	// mabye move this to the shader class????
	private enableUniforms(gl: WebGLRenderingContext): void {
		if (!this.programLinked) {
			this.programLinked = true;
			gl.linkProgram(this.programId);

			if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
				console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
			}
		}
		gl.useProgram(this.programId);

		// setup shader uniforms
		for (const shader of this.shaders.values()) {
			const uniforms = shader.Uniforms;

			for (const [ uniformName, uniformData ] of uniforms) {
				if (uniformName.id === -1) {
					const newID = gl.getUniformLocation(this.programId, uniformName.name);
					uniformName.id = newID;

					shader.setUniformIDFor(uniformName.name, newID);
				}

				if (uniformData.dataMatrix) {
					gl.uniformMatrix4fv(uniformName.id, false, uniformData.dataMatrix.flatten());
				}
				if (uniformData.dataValue) {
					const len = uniformData.dataValue.length;

					switch (len) {
						case 1:
							gl.uniform1fv(uniformName.id, uniformData.dataValue);
						case 2:
							gl.uniform2fv(uniformName.id, uniformData.dataValue);
						case 3:
							gl.uniform3fv(uniformName.id, uniformData.dataValue);
						case 4:
							gl.uniform4fv(uniformName.id, uniformData.dataValue);
					}
				}
			}
		}
	}
}

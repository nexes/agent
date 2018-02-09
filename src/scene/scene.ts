import { IRenderable } from '../renderer/common';
import { Shader, shaderType } from '../shader/shader';


export class Scene {
	private renderables: IRenderable[];
	private shaders: Shader[];
	private programId: WebGLProgram;

	constructor() {
		this.programId = null;
	}

	public addDrawable(...item: IRenderable[]): void {
		this.renderables.push(...item);
	}

	public addShader(gl: WebGLRenderingContext, shaderName: string, type: shaderType, data: string): void {
		const newShader = new Shader();

		newShader.setShaderData(gl, shaderName, type, data);
		this.shaders.push(newShader);

		if (this.programId === null) {
			this.programId = gl.createProgram();
		}

		gl.attachShader(this.programId, newShader.getId(shaderName));
		gl.linkProgram(this.programId);

		if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
			console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
		}
	}
}

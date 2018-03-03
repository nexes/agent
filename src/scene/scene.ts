import { IRenderable } from '../renderer';
import { Shader, ShaderType } from '../shader/shader';


export class Scene {
	private renderables: IRenderable[];
	private shaders: Map<ShaderType, Shader>;
	private programId: WebGLProgram;

	constructor() {
		this.shaders = new Map<ShaderType, Shader>();
		this.programId = null;
	}

	public addDrawable(...item: IRenderable[]): void {
		this.renderables.push(...item);
	}

	public render(gl: WebGLRenderingContext) {
		gl.useProgram(this.programId);

		for (const gObject of this.renderables) {
			gObject.bindBuffer(gl);
		}
	}

	public addShader(gl: WebGLRenderingContext, shaderName: string, type: ShaderType, data: string): void {
		const newShader = new Shader();

		if (this.programId === null) {
			this.programId = gl.createProgram();
		}

		newShader.setShaderData(gl, this.programId, shaderName, type, data);

		gl.attachShader(this.programId, newShader.getId(shaderName));
		gl.linkProgram(this.programId);

		this.shaders.set(type, newShader);

		if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
			console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
		}
	}
}

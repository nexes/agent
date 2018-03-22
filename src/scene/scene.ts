import { IRenderable } from '../renderer';
import { Shader, ShaderType } from '../shader/shader';


export class Scene {
	private renderables: IRenderable[];
	private shaders: Map<ShaderType, Shader>;
	private programId: WebGLProgram;

	constructor() {
		this.shaders = new Map<ShaderType, Shader>();
		this.renderables = [];
		this.programId = null;
	}

	public addDrawable(...item: IRenderable[]): void {
		this.renderables.push(...item);
	}

	// maybe not call this everytime render is needed. check if this is needed first
	public preRender(gl: WebGLRenderingContext): void {
		gl.linkProgram(this.programId);

		if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
			console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
		} else {
			console.log('program link okay dokay');
		}
	}

	public render(gl: WebGLRenderingContext) {
		gl.useProgram(this.programId);

		// TODO
		for (const gObject of this.renderables) {
			gObject.bindBuffer(gl);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		}
	}

	public addShader(gl: WebGLRenderingContext, type: ShaderType, data: string): void {
		const newShader = new Shader();

		if (this.programId === null) {
			this.programId = gl.createProgram();
		}

		newShader.setShaderData(gl, type, data);
		gl.attachShader(this.programId, newShader.ID);

		this.shaders.set(type, newShader);
	}

	public shader(shader: ShaderType): Shader {
		if (!this.shaders.has(shader)) {
			throw new Error(`Scene does not have shader type ${shader} assigned`);
		}
		return this.shaders.get(shader);
	}
}

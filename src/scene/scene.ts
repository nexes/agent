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
		this.shaders.set(type, newShader);
	}

	public shader(shader: ShaderType): Shader {
		if (!this.shaders.has(shader)) {
			throw new Error(`Scene does not have shader type ${shader} assigned`);
		}
		return this.shaders.get(shader);
	}
}

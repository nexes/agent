import { IRenderable } from '../renderer';
import { Shader, ShaderType } from '../shader/shader';


export class Scene {
	private renderables: IRenderable[];
	private shaders: Map<ShaderType, Shader>;
	private programId: WebGLProgram;
	private programLinked: boolean;

	constructor() {
		this.shaders = new Map<ShaderType, Shader>();
		this.renderables = [];
		this.programId = null;
		this.programLinked = false;
	}

	public addDrawable(...item: IRenderable[]): void {
		this.renderables.push(...item);
	}

	// this needs to be thought through more. this shouldn't be called with every render call? Right?
	public preRender(gl: WebGLRenderingContext): void {
		if (!this.programLinked) {
			this.programLinked = true;
			gl.linkProgram(this.programId);
		}

		for (const shaderData of this.shaders.values()) {
			const attrs = shaderData.Attributes;

			for (const att of attrs) {
				if (att.id === -1) {
					att.id = gl.getAttribLocation(this.programId, att.name);
				}

				const vertAttrib = shaderData.getVertexAttribFor(att.name);
				if (vertAttrib !== undefined) {
					gl.enableVertexAttribArray(att.id as number);
					gl.vertexAttribPointer(att.id as number, vertAttrib.size, gl.FLOAT, vertAttrib.normalized, vertAttrib.stride, vertAttrib.offset);

				} else {
					// TODO
					// get attribute data for vertexAttrib1f for example
				}
			}
		}

		if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
			console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
		}

		gl.useProgram(this.programId);
	}

	public render(gl: WebGLRenderingContext) {
		// TODO
		for (const gObject of this.renderables) {
			gObject.bindBuffer(gl);
			this.preRender(gl);

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

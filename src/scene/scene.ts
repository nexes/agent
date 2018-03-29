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
		this.initializeShader(gl);

		// TODO
		for (const gObject of this.renderables) {
			gObject.prepareBuffer(gl, this.programId);

			gl.drawArrays(gl.TRIANGLE_STRIP, 0, gObject.verticeCount());
		}
	}

	// this needs to be thought through more. this shouldn't be called with every render call? Right?
	private initializeShader(gl: WebGLRenderingContext): void {
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
			const uniforms = shader.getUniformData();

			for (const [ uniformName, uniformData ] of uniforms) {
				if (uniformName.id === -1) {
					const newID = gl.getUniformLocation(this.programId, uniformName.name);
					uniformName.id = newID;

					shader.setUniformIDFor(uniformName.name, newID);
				}

				if (uniformData.dataMatrix) {
					gl.uniformMatrix4fv(uniformName.id, false, uniformData.dataMatrix);
				}
				if (uniformData.dataValue) {
					// TODO
				}
			}
		}
	}
}

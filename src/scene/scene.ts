import Shader, { ShaderType } from '../shader';
import { IRenderable } from '../renderable';
import { ICamera } from '../camera';


export class Scene {
  private glCtx: WebGLRenderingContext;
  private camera: ICamera;
  private renderables: IRenderable[];
  private shaders: Map<ShaderType, Shader>;
  private programId: WebGLProgram;

  constructor(gl: WebGLRenderingContext) {
    this.glCtx = gl;
    this.shaders = new Map<ShaderType, Shader>();
    this.renderables = [];
    this.camera = null;
    this.programId = null;
  }

  public addDrawable(...item: IRenderable[]): void {
    this.renderables.push(...item);
  }

  public addCamera(camera: ICamera): void {
    this.camera = camera;
  }

  public addShader(type: ShaderType, data: string): void {
    if (this.programId === null) {
      this.programId = this.glCtx.createProgram();
    }

    const newShader = new Shader(this.glCtx);
    newShader.setShaderSource(this.programId, type, data);
    this.shaders.set(type, newShader);

    // only link the webgl program when we have a vertex and fragment shader. We need both before we link
    // I think this should be thought out more.
    if (this.shaders.size === 2 && this.shaders.has(ShaderType.Vertex) && this.shaders.has(ShaderType.Fragment)) {
      this.glCtx.linkProgram(this.programId);
    }
  }

  public shader(shader: ShaderType): Shader {
    if (!this.shaders.has(shader)) {
      throw new Error(`Scene does not have shader type ${shader} assigned`);
    }
    return this.shaders.get(shader);
  }

  /**
   * update the scenes renderable objects per the timestep passed
   * @param {number} dt the amout of time that has passed
   */
  public updateSimulationStep(dt: number): void {
    if (this.camera.update(dt)) {
      this.shaders.get(ShaderType.Vertex).updateUniformDataFor(this.camera.UUID, this.camera.matrix());
    }

    for (const obj of this.renderables) {
      // TODO
      // obj.updateSimulation(dt);
    }
  }

  public render() {
    for (const gObject of this.renderables) {
      // NOTE if the two maps have the same key, only the value of the last map is kept. This shouldn't be a problem here
      // since all keys are objects IShaderAttributeName, two objects with the same values are !=
      const objectVertexAttr = new Map([
        ...this.shaders.get(ShaderType.Vertex).vertexAttributes(gObject.UUID),
        ...this.shaders.get(ShaderType.Fragment).vertexAttributes(gObject.UUID),
      ]);

      gObject.enableBufferData(this.glCtx, objectVertexAttr);

      this.enableShaderAttributes(gObject.UUID);
      this.glCtx.useProgram(this.programId);
      this.glCtx.drawArrays(this.glCtx.TRIANGLE_STRIP, 0, gObject.verticeCount());

      gObject.disableBuffer(this.glCtx, objectVertexAttr);
    }
  }

  private enableShaderAttributes(objectID: string): void {
    const gl = this.glCtx;

    for (const shader of this.shaders.values()) {
      const attributes = shader.shaderAttributes();

      for (const [ attName, attData ] of attributes) {
        gl.enableVertexAttribArray(attName.id as number);
        const len = attData.attributeValue.length;

        switch (len) {
          case 1:
            gl.vertexAttrib1fv(attName.id as number, attData.attributeValue);
            break;
          case 2:
            gl.vertexAttrib2fv(attName.id as number, attData.attributeValue);
            break;
          case 3:
            gl.vertexAttrib3fv(attName.id as number, attData.attributeValue);
            break;
          case 4:
            gl.vertexAttrib4fv(attName.id as number, attData.attributeValue);
            break;
        }
      }
    }
  }
}

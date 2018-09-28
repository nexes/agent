import Shader, { ShaderType } from '../shader';
import { IRenderable } from '../renderable';
import { ICamera } from '../camera';


export class Scene {
  private glCtx: WebGLRenderingContext;
  private camera: ICamera;
  private renderables: IRenderable[];
  private sceneShader: Shader;
  private shaderDirty: boolean;

  constructor(gl: WebGLRenderingContext) {
    this.glCtx = gl;
    this.sceneShader = Shader.NewWithDefaults(gl);
    this.renderables = [];
    this.camera = null;
    this.shaderDirty = false;
  }

  public addDrawable(...item: IRenderable[]): void {
    this.renderables.push(...item);
  }

  public addCamera(camera: ICamera): void {
    this.camera = camera;
  }

  /**
   * Set the shader for this scene. Scenes can only have one shader object at a time
   */
  public setShader(shader: Shader) {
    this.sceneShader.clear(this.glCtx);
    this.sceneShader = shader;
    this.shaderDirty = true;
    }

  /**
   * Setup the shaders sources and the shaders uniforms and variables. If the shader hasn't changed
   * this does nothing.
   */
  public initialize(): void {
    if (this.shaderDirty) {
      this.shaderDirty = false;
      this.sceneShader.initialize(this.glCtx);
    }
  }

  /**
   * update the scenes renderable objects per the timestep passed
   * @param {number} dt the amout of time that has passed
   */
  public updateSimulationStep(dt: number): void {
    if (this.camera.update(dt)) {
      const varName = this.sceneShader.getNameFromUUID(this.camera.UUID);
      this.sceneShader.setUniformData(varName.name, this.camera.uniform);
    }

    for (const obj of this.renderables) {
      // TODO
      // obj.updateSimulation(dt);
    }
  }

  public render() {
    for (const gObject of this.renderables) {
      const objectVertAttr = this.sceneShader.getAttributesFromUUID(gObject.UUID);

      gObject.enableBufferData(this.glCtx, objectVertAttr);

      // this.enableShaderAttributes(gObject.UUID);
      // this.glCtx.useProgram(this.programId);
      this.glCtx.drawArrays(this.glCtx.TRIANGLE_STRIP, 0, gObject.verticeCount());

      gObject.disableBuffer(this.glCtx, objectVertAttr);
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

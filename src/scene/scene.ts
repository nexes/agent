import Shader from '../shader';
import { IRenderable } from '../renderable';
import { ICamera } from '../camera';


export class Scene {
  private glCtx: WebGLRenderingContext;
  private camera: ICamera;
  private renderables: IRenderable[];
  private sceneShader: Shader;
  private shaderDirty: boolean;
  private usingDefaultShader: boolean;

  constructor(gl: WebGLRenderingContext) {
    this.glCtx = gl;
    this.sceneShader = Shader.NewWithDefaults(gl);
    this.renderables = [];
    this.camera = null;
    this.shaderDirty = false;
    this.usingDefaultShader = true;
  }

  public addDrawable(...items: IRenderable[]): void {
    this.renderables.push(...items);

    if (this.usingDefaultShader) {
      for (const renderable of items) {
        this.sceneShader.setAttributeData('aPosition', renderable.vertexAttributes());
        this.sceneShader.setAttributeData('aTexture', renderable.textureAttributes());
        // TODO: add color
        // TODO: handle modelview
      }
    }
  }

  public addCamera(camera: ICamera): void {
    this.camera = camera;

    if (this.usingDefaultShader) {
      this.sceneShader.setUniformData('camera', camera.uniform);
    }
  }

  /**
   * Set the shader for this scene. Scenes can only have one shader object at a time
   */
  public setShader(shader: Shader) {
    this.sceneShader.clear(this.glCtx);
    this.sceneShader = shader;
    this.shaderDirty = true;
    this.usingDefaultShader = false;
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

      this.glCtx.drawArrays(this.glCtx.TRIANGLE_STRIP, 0, gObject.verticeCount());

      gObject.disableBuffer(this.glCtx, objectVertAttr);
    }
  }
}

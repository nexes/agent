import { IVertexAttribute } from '../shader';
import { defaultVertexSource, defaultFragmentSource } from '../shader/source';


import {
  ShaderType,
  Attribute,
  Uniform,
  IUniformType,
} from '../shader';

export class Shader {
  private glCtx: WebGLRenderingContext;
  private programID: WebGLProgram;
  private shaderID: Map<ShaderType, WebGLShader>;
  private attributes: Attribute;
  private uniforms: Uniform;
  private vertexSource: string;
  private fragmentSource: string;

  constructor() {
    this.glCtx = null;
    this.programID = null;
    this.shaderID = new Map();
    this.attributes = new Attribute();
    this.uniforms = new Uniform();
    this.vertexSource = null;
    this.fragmentSource = null;
  }

  public static NewWithDefaults(gl: WebGLRenderingContext): Shader {
    const s = new Shader();
    s.glCtx = gl;
    s.setSource(defaultVertexSource, defaultFragmentSource);

    // set default attributes and uniforms
    // TODO

    s.initialize(gl);
    return s;
  }

  public setSource(vertexSrc: string, fragmentSrc: string) {
    this.vertexSource = vertexSrc;
    this.fragmentSource = fragmentSrc;

    this.parseShaderVariables(vertexSrc);
    this.parseShaderVariables(fragmentSrc);
  }

  public getNameFromUUID(uuid: string): {name: string, type: string} {
    const uniformName = this.uniforms.getNameFromUUID(uuid);
    const attributeName = this.attributes.getNameFromUUID(uuid);

    if (uniformName) { return { name: uniformName, type: 'uniform' }; }
    if (attributeName) { return { name: attributeName, type: 'attribute' }; }
    return undefined;
  }

  public getAttributesFromUUID(uuid: string): IVertexAttribute[] {
    return this.attributes.getAttributesFromUUID(uuid);
  }

  public getUniformsFromUUID(uuid: string): Array<{type: string, data: Float32Array}> {
    return this.uniforms.getUniformsFromUUID(uuid);
  }

  public setAttributeData(name: string, data: IVertexAttribute) {
    if (!this.attributes.has(name)) {
      throw new Error(`Error: no attribute variable \"${name}\" found in the shader`);
    }

    this.attributes.setDataFor(name, data, this.programID, this.glCtx);
  }

  public setUniformData(name: string, data: IUniformType) {
    if (!this.uniforms.has(name)) {
      throw new Error(`Error: no uniform variable \"${name}\" found in the shader`);
    }

    this.uniforms.setDataFor(name, data, this.programID, this.glCtx);
  }

  public initialize(gl: WebGLRenderingContext) {
    this.glCtx = gl;

    if (!this.programID) {
      this.programID = gl.createProgram();
    }

    const vertId = this.compileShaderSource(ShaderType.Vertex, this.vertexSource);
    const fragId = this.compileShaderSource(ShaderType.Fragment, this.fragmentSource);

    this.shaderID.set(ShaderType.Vertex, vertId);
    this.shaderID.set(ShaderType.Fragment, fragId);

    gl.attachShader(this.programID, vertId);
    gl.attachShader(this.programID, fragId);
    gl.linkProgram(this.programID);
    gl.validateProgram(this.programID);

    if (!gl.getProgramParameter(this.programID, gl.LINK_STATUS)) {
      const err = gl.getProgramInfoLog(this.programID);
      throw new Error(`Error: shader link status ${err}`);
    }

    this.uniforms.initialize(this.programID, this.glCtx);
    this.attributes.initialize(this.programID, this.glCtx);
  }

  /**
   * This will detach the shaders and delete the shader program, then clear any held uniform
   * and attributes. This is generally used when a new shader is to be used.
   * @param {WebGLRenderingContext} gl the webgl rendering context
   */
  public clear(gl: WebGLRenderingContext) {
    this.uniforms.clear();
    this.attributes.clear();

    gl.detachShader(this.programID, this.shaderID.get(ShaderType.Vertex));
    gl.detachShader(this.programID, this.shaderID.get(ShaderType.Fragment));
    gl.deleteProgram(this.programID);

    this.shaderID.clear();
  }

  private parseShaderVariables(source: string) {
    const sourceLines = source.toLowerCase().split('\n');
    let inCommentBlock = false;

    // clear anything that might be there for new variables
    this.attributes.clear();
    this.uniforms.clear();

    for (let line of sourceLines) {
      line = line.trim();
      const comment = line.slice(0, 2);

      switch (comment) {
        case '//':
          // nothing to do, we just skip
          break;

        case '/*':
          const len = line.length;
          const last = line.slice(len - 2);
          if (last !== '*/') {
            inCommentBlock = true;
          }
          break;

        case '*/':
          inCommentBlock = false;
          break;

        default:
          const lineArr = line.split(/\s+/gi);
          if (lineArr[ 0 ] === 'attribute' && !inCommentBlock) {
            this.attributes.addAttribute(lineArr[ 1 ], lineArr[ 2 ]);

          } else if (lineArr[ 0 ] === 'uniform' && !inCommentBlock) {
            this.uniforms.addUniform(lineArr[ 1 ], lineArr[ 2 ]);
          }
          break;
      }
    }
  }

  private compileShaderSource(type: ShaderType, source: string): WebGLShader {
    const gl = this.glCtx;
    const shaderID = gl.createShader(type);

    gl.shaderSource(shaderID, source);
    gl.compileShader(shaderID);
    if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
      // should we throw, or setup a dispatch system?
      throw new Error(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(shaderID)}`);
    }

    return shaderID;
  }
}

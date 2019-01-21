export { Shader as default } from './shader';
export { Attribute, IAttributeValue } from './attribute';
export { Uniform, IUniformValue } from './uniform';

export enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
}

export interface IVertexAttribute {
  readonly UUID: string;
  readonly size: number;
  readonly normalized: boolean;
  readonly stride: number;
  readonly offset: number;
}

export interface IConstVertexAttribute {
  uuid: string;
  attributeData: Float32Array;
}

export interface IUniformAttribute {
  uuid: string;
  uniformData: Float32Array;
}

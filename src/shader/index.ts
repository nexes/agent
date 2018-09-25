export { Shader as default } from './shader';
export { Attribute } from './attribute';
export { Uniform } from './uniform';

export enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
}

export interface IUniformType {
  UUID: string;
  uniformData: Float32Array;
}

export interface IVertexAttribute {
  readonly UUID: string;
  readonly size: number;
  readonly normalized: boolean;
  readonly stride: number;
  readonly offset: number;
}

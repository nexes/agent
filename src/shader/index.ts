import { Matrix4 } from '../math';
export { Shader as default } from './shader';

export enum ShaderType {
  Vertex = WebGLRenderingContext.VERTEX_SHADER,
  Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
}

export interface IShaderAttributeName {
  name: string;
  id: number | WebGLUniformLocation;
}

export interface IUniformAttribute {
  readonly UUID: string;
  readonly uniformMatrix?: Matrix4;
  readonly uniformValue?: Float32Array;
}

export interface IVertexAttribute {
  readonly UUID: string;
  readonly size: number;
  readonly normalized: boolean;
  readonly stride: number;
  readonly offset: number;
}

export interface IAttributeValue {
  readonly vertexAttribute?: IVertexAttribute;
  readonly attributeValue?: Float32Array;
}

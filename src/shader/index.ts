export { Shader as default } from './shader';

export enum ShaderType {
	Vertex = WebGLRenderingContext.VERTEX_SHADER,
	Fragment = WebGLRenderingContext.FRAGMENT_SHADER,
}

export interface IShaderAttrib {
	name: string;
	id: number | WebGLUniformLocation;
}

export interface IVertexAttribute {
	readonly size: number;
	readonly normalized: boolean;
	readonly stride: number;
	readonly offset: number;
}

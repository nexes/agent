import { IUniformType } from '../shader';


interface IUniformData {
  type: string;
  uuid: string;
  location: WebGLUniformLocation;
  data: Float32Array;
}

export class Uniform {
  private uniformLookup: Map<string, IUniformData>;

  constructor() {
    this.uniformLookup = new Map();
  }

  /**
   * Add a new uniform variable from the shader. If a uniform variable of the same name already
   * exists, it will be replaced.
   * @param {string} type the unfiform type
   * @param {string} name the unfiform name
   */
  public addUniform(type: string, name: string): void {
    this.uniformLookup.set(name, {
      type,
      uuid: '',
      location: -1,
      data: null,
    });
  }

  /**
   * Set or update data to the uniform variable. If the data has once been set for this variable before,
   * then the variable will be updated with the new given data.
   * @param {string} name the name of the uniform variable
   * @param {IUniformType} data the uniform data and uuid
   * @param {WebGLProgram} programID Optional, the webgl program ID
   * @param {WebGLRenderingContext} gl Optional, if given the data will be sent to webgl
   * @throws If the variable name or location is not found or incompatible data is passed
   */
  public setDataFor(name: string, data: IUniformType, programID?: WebGLProgram, gl?: WebGLRenderingContext): void {
    const value = this.uniformLookup.get(name);
    if (!value) {
      throw new Error(`Uniform variable ${name} wasn't found`);
    }

    value.uuid = data.UUID;
    value.data = data.uniformData;

    if (gl && programID) {
      gl.useProgram(programID);

      if (value.location === -1) {
        value.location = gl.getUniformLocation(programID, name);

        if (!value.location) {
          throw new Error(`Uniform could not get location for uniform ${name}`);
        }
      }

      switch (value.data.length) {
        case 1: gl.uniform1fv(value.location, value.data); break;
        case 2: gl.uniform2fv(value.location, value.data); break;
        case 3: gl.uniform3fv(value.location, value.data); break;
        case 4: gl.uniform4fv(value.location, value.data); break;
        case 9: gl.uniformMatrix3fv(value.location, false, value.data); break;
        case 16: gl.uniformMatrix4fv(value.location, false, value.data); break;
        default: throw new Error('uniform float32array length has an incompatible length');
      }
    }

    this.uniformLookup.set(name, value);
  }

  /**
   * Get the uniform name as it appears in the shader code for the given uuid
   * @param {string} uuid the uuid for the uniform to be found
   * @returns {string} the uniform variable name
   */
  public getNameFromUUID(uuid: string): string {
    for (const [ name, value ] of this.uniformLookup) {
      if (value.uuid === uuid) {
        return name;
      }
    }
    return undefined;
  }

  /**
   * Check if the shader has a uniform with a given name
   * @param {string} name the name to check
   * @returns {boolean} if the name was found
   */
  public has(name: string): boolean {
    return this.uniformLookup.has(name);
  }

  /**
   * Clear the uniform data the shader is holding.
   */
  public clear(): void {
    this.uniformLookup.clear();
  }

  /**
   * Setup the shaders uniforms
   * @param {WebGLProgram} programID the shaders program ID
   * @param {WebGLRenderingContext} gl the webgl rendering context
   */
  public initialize(programID: WebGLProgram, gl: WebGLRenderingContext): void {
    const unf = this.uniformLookup;

    for (const [ name, value ] of unf) {
      this.setDataFor(name, { UUID: value.uuid, uniformData: value.data }, programID, gl);
    }
  }
}

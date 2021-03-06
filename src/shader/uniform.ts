import { IUniformAttribute } from '../shader';


interface IUniformKey {
  name: string;
  type: string;
}

export interface IUniformValue {
  location: WebGLUniformLocation;
  data: IUniformAttribute[];
}

export class Uniform {
  private uniformLookup: Map<IUniformKey, IUniformValue>;

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
    this.uniformLookup.set({name, type}, {
      location: -1,
      data: [],
    });
  }

  /**
   * Set or update data to the uniform variable. If the data has once been set for this variable before,
   * then the variable will be updated with the new given data.
   * @param {string} name the name of the uniform variable
   * @param {IUniformAttribute | IUniformAttribute[]} data the uniform data and uuid
   * @param {WebGLProgram} programID Optional, the webgl program ID
   * @param {WebGLRenderingContext} gl Optional, if given the data will be sent to webgl
   * @throws If the variable name or location is not found or incompatible data is passed
   */
  public setDataFor(name: string, data: IUniformAttribute | IUniformAttribute[], programID?: WebGLProgram, gl?: WebGLRenderingContext): void {
    let _key;
    let _value;

    for (const [ key, value ] of this.uniformLookup) {
      if (key.name === name) {
        _key = key;
        _value = value;
      }
    }

    if (!_key) {
      throw new Error(`Uniform variable ${name} wasn't found`);
    }

    Array.isArray(data) ? _value.data.push(...data) : _value.data.push(data);

    if (gl && programID) {
      gl.useProgram(programID);

      if (_value.location === -1) {
        _value.location = gl.getUniformLocation(programID, name);

        if (_value.location === -1) {
          throw new Error(`Uniform could not get location for uniform ${name}`);
        }
      }

      if (Array.isArray(data)) {
        for (const _uniform of data) {
          switch (_uniform.uniformData.length) {
            case 1: gl.uniform1fv(_value.location, _uniform.uniformData); break;
            case 2: gl.uniform2fv(_value.location, _uniform.uniformData); break;
            case 3: gl.uniform3fv(_value.location, _uniform.uniformData); break;
            case 4: gl.uniform4fv(_value.location, _uniform.uniformData); break;
            case 9: gl.uniformMatrix3fv(_value.location, false, _uniform.uniformData); break;
            case 16: gl.uniformMatrix4fv(_value.location, false, _uniform.uniformData); break;
            default: throw new Error('uniform float32array length has an incompatible length');
          }
        }

      } else {
        switch (data.uniformData.length) {
          case 1: gl.uniform1fv(_value.location, data.uniformData); break;
          case 2: gl.uniform2fv(_value.location, data.uniformData); break;
          case 3: gl.uniform3fv(_value.location, data.uniformData); break;
          case 4: gl.uniform4fv(_value.location, data.uniformData); break;
          case 9: gl.uniformMatrix3fv(_value.location, false, data.uniformData); break;
          case 16: gl.uniformMatrix4fv(_value.location, false, data.uniformData); break;
          default: throw new Error('uniform float32array length has an incompatible length');
        }
      }
    }

    this.uniformLookup.set(_key, _value);
  }

  /**
   * Get the uniform name as it appears in the shader code for the given uuid
   * @param {string} uuid the uuid for the uniform to be found
   * @returns {string} the uniform variable name
   */
  public getNameFromUUID(uuid: string): string {
    for (const [ key, value ] of this.uniformLookup) {
      for (const uniform of value.data) {
        if (uniform.uuid === uuid) {
          return key.name;
        }
      }
    }
    return undefined;
  }

  /**
   * Get any uniforms that have been assigned to the given UUID
   * @param {string} uuid the objects UUID
   * @returns an array of objects with the uniforms type and data
   */
  // public getUniformsFromUUID(uuid: string): Array<{type: string, data: Float32Array}> {
  public getUniformsFromUUID(uuid: string): IUniformValue[] {
    const _uniforms: IUniformValue[] = [];

    for (const [key, value] of this.uniformLookup) {
      for (const uniform of value.data) {
        if (uniform.uuid === uuid) {
          _uniforms.push(value);
        }
      }
    }
    return _uniforms;
  }

  /**
   * Check if the shader has a uniform with a given name
   * @param {string} name the name to check
   * @returns {boolean} if the name was found
   */
  public has(name: string): boolean {
    for (const key of this.uniformLookup.keys()) {
      if (key.name === name) {
        return true;
      }
    }
    return false;
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

    for (const [ key, value ] of unf) {
      if (!value.data) {
        console.log(`Warning: No data was set for uniform ${key.name}`);

      } else {
        this.setDataFor(key.name, value.data, programID, gl);
      }
    }
  }
}

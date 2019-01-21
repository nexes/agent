import { IVertexAttribute, IConstVertexAttribute } from '../shader';


interface IAttributeKey {
  name: string;
  type: string;
}

export interface IAttributeValue {
  location: number;
  data?: IVertexAttribute[];
  constData?: IConstVertexAttribute[];
}

export class Attribute {
  private attributeLookup: Map<IAttributeKey, IAttributeValue>;

  constructor() {
    this.attributeLookup = new Map();
  }

  /**
   * Add a new attribute variable from the shader. If an attribute variable of the same name already
   * exists, it will be replaced.
   * @param {string} type the attribute type
   * @param {string} name the attribute name
   */
  public addAttribute(type: string, name: string) {
    this.attributeLookup.set({name, type}, {
      location: -1,
      data: [],
      constData: [],
    });
  }

  /**
   * Set or update data to the attribute variable. If the data has once been set for this variable before,
   * then the variable will be updated with the new given data.
   * @param {string} name the name of the attribute variable
   * @param {IVertexAttribute | IVertexAttribute[]} data the attribute data
   * @param {WebGLProgram} programID Optional, the webgl program ID
   * @param {WebGLRenderingContext} gl Optional, if given the data will be sent to webgl
   * @throws If the variable name or location is not found or incompatible data is passed
   */
  public setDataFor(name: string, data: IVertexAttribute | IVertexAttribute[], programID?: WebGLProgram, gl?: WebGLRenderingContext): void {
    let _att;
    let _key;
    for (const [ key, value ] of this.attributeLookup) {
      if (key.name === name) {
        _key = key;
        _att = value;
      }
    }

    if (!_key) {
      throw new Error(`Attribute variable ${name} wasn't found`);
    }

    Array.isArray(data) ? _att.data.push(...data) : _att.data.push(data);

    if (gl && programID) {
      if (_att.location === -1) {
        _att.location = gl.getAttribLocation(programID, name);

        if (_att.location === -1) {
          throw new Error(`Attribute: could not get location for attribute ${name}`);
        }
      }
    }

    this.attributeLookup.set(_key, _att);
  }

  public setConstDataFor(name: string, data: IConstVertexAttribute | IConstVertexAttribute[], programID?: WebGLProgram, gl?: WebGLRenderingContext): void{
    let _att;
    let _key;
    for (const [key, value] of this.attributeLookup) {
      if (key.name === name) {
        _key = key;
        _att = value;
      }
    }

    if (!_key) {
      throw new Error(`Attribute variable ${name} wasn't found`);
    }

    Array.isArray(data) ? _att.constData.push(...data) : _att.constData.push(data);

    if (gl && programID) {
      if (_att.location === -1) {
        _att.location = gl.getAttribLocation(programID, name);

        if (_att.location === -1) {
          throw new Error(`Attribute: could not get location for attribute ${name}`);
        }
      }

      if (Array.isArray(data)) {
        for (const _constAttr of data) {
          switch (_constAttr.attributeData.length) {
            case 1: gl.vertexAttrib1fv(_att.location, _constAttr.attributeData); break;
            case 2: gl.vertexAttrib2fv(_att.location, _constAttr.attributeData); break;
            case 3: gl.vertexAttrib3fv(_att.location, _constAttr.attributeData); break;
            case 4: gl.vertexAttrib4fv(_att.location, _constAttr.attributeData); break;
          }
        }

      } else {
        switch (data.attributeData.length) {
          case 1: gl.vertexAttrib1fv(_att.location, data.attributeData); break;
          case 2: gl.vertexAttrib2fv(_att.location, data.attributeData); break;
          case 3: gl.vertexAttrib3fv(_att.location, data.attributeData); break;
          case 4: gl.vertexAttrib4fv(_att.location, data.attributeData); break;
        }
      }
    }

    this.attributeLookup.set(_key, _att);
  }

  /**
   * Check if the shader has an attribute with a given name
   * @param {string} name the name to check
   * @returns {boolean} if the name was found
   */
  public has(name: string): boolean {
    for (const key of this.attributeLookup.keys()) {
      if (key.name === name) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clear the attribute data the shader is holding.
   */
  public clear() {
    this.attributeLookup.clear();
  }

  /**
   * Get the attribute name as it appears in the shader code for the given uuid
   * @param {string} uuid the uuid for the attribute to be found
   * @returns {string} the attribute variable name
   */
  public getNameFromUUID(uuid: string): string {
    for (const [ key, value ] of this.attributeLookup) {
      for (const attribute of value.data) {
        if (attribute.UUID === uuid) {
          return key.name;
        }
      }
    }
    return undefined;
  }

  /**
   * Get any attributes that have been assigned to the given UUID
   * @param {string} uuid the objects UUID
   * @returns an array of attribute data
   */
  public getAttributesFromUUID(uuid: string): IAttributeValue[] {
    const _att: IAttributeValue[] = [];

    for (const [key, value] of this.attributeLookup) {
      for (const attribute of value.data) {
        if (attribute.UUID === uuid) {
          _att.push(value);
        }
      }
    }
    return _att;
  }

  /**
   * Setup the shaders attributes
   * @param {WebGLProgram} programID the shaders program ID
   * @param {WebGLRenderingContext} gl the webgl rendering context
   */
  public initialize(programID: WebGLProgram, gl: WebGLRenderingContext): void {
    const attr = this.attributeLookup;

    for (const [ key, value ] of attr) {
      if (!value.data && !value.constData) {
        console.log(`Warning: No data was set for attribute ${key.name}`);

      } else {
        if (value.data.length > 0) {
          this.setDataFor(key.name, value.data, programID, gl);

        } else if (value.constData.length > 0) {
          this.setConstDataFor(key.name, value.constData, programID, gl);
        }
      }
    }
  }
}

import { IVertexAttribute } from '../shader';


interface IAttributeData {
  type: string;
  location: number;
  data: IVertexAttribute;
}

export class Attribute {
  private attributeLookup: Map<string, IAttributeData>;

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
    this.attributeLookup.set(name, {
      type,
      location: -1,
      data: null,
    });
  }

  /**
   * Set or update data to the attribute variable. If the data has once been set for this variable before,
   * then the variable will be updated with the new given data.
   * @param {string} name the name of the attribute variable
   * @param {IVertexAttribute} data the attribute data
   * @param {WebGLProgram} programID Optional, the webgl program ID
   * @param {WebGLRenderingContext} gl Optional, if given the data will be sent to webgl
   * @throws If the variable name or location is not found or incompatible data is passed
   */
  public setDataFor(name: string, data: IVertexAttribute, programID?: WebGLProgram, gl?: WebGLRenderingContext): void {
    const att = this.attributeLookup.get(name);
    if (!att) {
      throw new Error(`Attribute variable ${name} wasn't found`);
    }

    att.data = data;

    if (gl && programID) {
      if (att.location === -1) {
        att.location = gl.getAttribLocation(programID, name);

        if (att.location === -1) {
          throw new Error(`Attribute: could not get location for attribute ${name}`);
        }
      }
    }

    this.attributeLookup.set(name, att);
  }

  /**
   * Check if the shader has an attribute with a given name
   * @param {string} name the name to check
   * @returns {boolean} if the name was found
   */
  public has(name: string): boolean {
    return this.attributeLookup.has(name);
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
    for (const [ name, value ] of this.attributeLookup) {
      if (value.data.UUID === uuid) {
        return name;
      }
    }
    return undefined;
  }

  /**
   * Get any attributes that have been assigned to the given UUID
   * @param {string} uuid the objects UUID
   * @returns an array of attribute data
   */
  public getAttributesFromUUID(uuid: string): IVertexAttribute[] {
    const _att: IVertexAttribute[] = [];
    for (const attribute of this.attributeLookup.values()) {
      if (attribute.data.UUID === uuid) {
        _att.push(attribute.data);
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

    for (const [ name, value ] of attr) {
      this.setDataFor(name, value.data, programID, gl);
    }
  }
}

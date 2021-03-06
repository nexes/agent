export { OrthographicCamera, PerspectiveCamera } from './camera';
export { Tile, Mesh } from './renderable';
export { default as Scene } from './scene';
export { default as Engine, IKeyboardEvent, IMouseEvent, Clock } from './engine';
export { default as Shader, ShaderType } from './shader';
export {
  default as Texutre,
  Sprite,
  SpriteSheet,
  stringToTextureJSON,
  ITextureJSON,
} from './texture';
export * from './math';


export function UUID(): string {
  // this creates a "uuid", not a uuid that satisfies RFC 4122, but good enough for the time.
  // TODO: create RFC 4122 UUID
  const uuidStr: number[] = [];
  const prn = new Uint32Array(4);

  crypto.getRandomValues(prn);
  for (const value of prn) {
    uuidStr.push(value);
  }

  return uuidStr.join('-');
}

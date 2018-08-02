export { Engine as default } from './engine';
export { Input } from './input';


export interface IEngineOptions {
  /**
   * @property the width of the Canvas
   */
  readonly width: number;

  /**
   * @property the height of the Canvas
   */
  readonly height: number;

  /**
   * @property optional if the Canvas will be the size of the window
   */
  readonly fullscreen?: boolean;

  /**
   * @property optional html canvas, if one is not passed one will be created and inserted
   */
  readonly domCanvas?: HTMLCanvasElement;

  /**
   * @property optional WebGL context, if one is not passed one will be created
   */
  readonly glContext?: WebGLRenderingContext;

  /**
   * @property optional remember the previous user inputs.
   * @default unlimited
   */
  readonly inputHistory?: number;
}

export interface IEvent {
  type: string;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export interface IKeyboardEvent extends IEvent {
  key: string;
  keyCode: number;
}

export interface IMouseEvent extends IEvent {
  button: number;
  clientX: number;
  clientY: number;
}

import { IEvent, IKeyboardEvent, IMouseEvent } from '../engine';


type InputFunc = (event: IEvent) => void;
enum InputType {
  keyboard = 0,
  mouse,
  controller,
  deviceCount,
}

export class Input {
  private eventCallbacks: InputFunc[];

  constructor() {
    this.eventCallbacks = new Array(InputType.deviceCount);
  }

  public attachEventListener(element: HTMLCanvasElement): void {
    // TODO: i would rather have this on the canvas element
    document.addEventListener('keydown', this.keyboardEventListener.bind(this), false);
    document.addEventListener('keyup', this.keyboardEventListener.bind(this), false);
    document.addEventListener('keypress', this.keyboardEventListener.bind(this), false);

    element.addEventListener('mousedown', this.mouseEventListener.bind(this), false);
    element.addEventListener('mouseup', this.mouseEventListener.bind(this), false);
    element.addEventListener('mousemove', this.mouseEventListener.bind(this), false);
  }


  public attachKeyboardListener(cfunc: (event: IEvent) => void): void {
    this.eventCallbacks[ InputType.keyboard ] = cfunc;
  }

  public attachMouseListener(cfunc: (event: IEvent) => void): void {
    this.eventCallbacks[ InputType.mouse ] = cfunc;
  }

  // TODO: this is only supported on chrome at the moment. navigator.getGamePads()
  public attachControllerListener(cfunc: (event: IEvent) => void): void {
    this.eventCallbacks[ InputType.controller ] = cfunc;
  }

  private async keyboardEventListener(keyEvent: KeyboardEvent): Promise<void> {
    const e: IKeyboardEvent = {
      type: keyEvent.type,
      key: keyEvent.key,
      keyCode: keyEvent.keyCode,
      altKey: keyEvent.altKey,
      shiftKey: keyEvent.shiftKey,
      metaKey: keyEvent.metaKey,
    };

    this.eventCallbacks[ InputType.keyboard ](e);
    keyEvent.preventDefault();
  }

  private async mouseEventListener(mouseEvent: MouseEvent): Promise<void> {
    const e: IMouseEvent = {
      type: mouseEvent.type,
      button: mouseEvent.button,
      clientX: mouseEvent.clientX,
      clientY: mouseEvent.clientY,
      altKey: mouseEvent.altKey,
      shiftKey: mouseEvent.shiftKey,
      metaKey: mouseEvent.metaKey,
    };

    this.eventCallbacks[ InputType.mouse ](e);
    mouseEvent.preventDefault();
  }
}

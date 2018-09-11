import { IEvent, IKeyboardEvent, IMouseEvent } from '../engine';


type InputFunc = (event: IEvent) => void;
enum InputType {
  keyPressDown = 0,
  keyPressUp,
  mouseDown,
  mouseUp,
  mouseMove,
  mouseClick,
  controller,
  deviceCount,
}

export class Input {
  private eventCallbacks: Map<InputType, InputFunc[]>;

  constructor(mouseEvent: HTMLCanvasElement) {
    this.eventCallbacks = new Map();

    document.addEventListener('keydown', this.keyboardEventListener.bind(this), false);
    document.addEventListener('keyup', this.keyboardEventListener.bind(this), false);
    // document.addEventListener('keypress', this.keyboardEventListener.bind(this), false);

    mouseEvent.addEventListener('click', this.mouseEventListener.bind(this), false);
    mouseEvent.addEventListener('dblclick', this.mouseEventListener.bind(this), false);
    mouseEvent.addEventListener('mousedown', this.mouseEventListener.bind(this), false);
    mouseEvent.addEventListener('mouseup', this.mouseEventListener.bind(this), false);
    mouseEvent.addEventListener('mousemove', this.mouseEventListener.bind(this), false);
  }

  public keyDownEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.keyPressDown);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.keyPressDown, events);
  }

  public keyUpEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.keyPressUp);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.keyPressUp, events);
  }

  public mouseDownEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.mouseDown);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.mouseDown, events);
  }

  public mouseUpEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.mouseUp);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.mouseUp, events);
  }

  public mouseMoveEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.mouseMove);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.mouseMove, events);
  }

  public mouseClickEvent(cfunc: (event: IEvent) => void): void {
    let events = this.eventCallbacks.get(InputType.mouseClick);
    if (!events) {
      events = [];
    }

    events.push(cfunc);
    this.eventCallbacks.set(InputType.mouseClick, events);
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

    if (keyEvent.type === 'keydown') {
      const events = this.eventCallbacks.get(InputType.keyPressDown);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    } else if (keyEvent.type === 'keyup') {
      const events = this.eventCallbacks.get(InputType.keyPressUp);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    }

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

    if (mouseEvent.type === 'mouseup') {
      const events = this.eventCallbacks.get(InputType.mouseUp);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    } else if (mouseEvent.type === 'mousedown') {
      const events = this.eventCallbacks.get(InputType.mouseDown);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    } else if (mouseEvent.type === 'click' || mouseEvent.type === 'dblclick') {
      const events = this.eventCallbacks.get(InputType.mouseClick);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    } else if (mouseEvent.type === 'mousemove') {
      const events = this.eventCallbacks.get(InputType.mouseMove);
      if (events) {
        for (const event of events) {
          event(e);
        }
      }
    }

    mouseEvent.preventDefault();
  }
}

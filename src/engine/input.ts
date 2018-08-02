import { IEvent, IKeyboardEvent, IMouseEvent } from '../engine';


export class Input {
  private userEventList: IEvent[];
  private historyCount: number;

  constructor(history?: number) {
    this.historyCount = history;
    this.userEventList = history ? new Array(history) : new Array();
  }

  public attach(element: HTMLCanvasElement): void {
    // TODO: i would rather have this on the canvas element
    document.addEventListener('keydown', this.keyboardEventListener.bind(this), false);
    document.addEventListener('keyup', this.keyboardEventListener.bind(this), false);
    document.addEventListener('keypress', this.keyboardEventListener.bind(this), false);

    element.addEventListener('mousedown', this.mouseEventListener.bind(this), false);
    element.addEventListener('mouseup', this.mouseEventListener.bind(this), false);
    element.addEventListener('mousemove', this.mouseEventListener.bind(this), false);
  }

  public pollEvents(): IEvent {
    return this.userEventList.shift();
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

    if (this.historyCount && this.userEventList.length >= this.historyCount) {
      // remove the oldes, add the latest. Is the O(n) + O(m), or O(n^2), is there a better way?
      this.userEventList.shift();
      this.userEventList.push(e);

    } else {
      this.userEventList.push(e);
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

    if (this.historyCount && this.userEventList.length >= this.historyCount) {
      // remove the old, add the latest. Is the O(n) + O(m), or O(n^2), is there a better way?
      this.userEventList.shift();
      this.userEventList.push(e);

    } else {
      this.userEventList.push(e);
    }
    mouseEvent.preventDefault();
  }
}

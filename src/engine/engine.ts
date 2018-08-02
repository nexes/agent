import Scene from '../scene';
import Texture, { SpriteSheet } from '../texture';
import { IEngineOptions, Input, IEvent,  IKeyboardEvent, IMouseEvent } from '../engine';
import { WebGLRenderer } from './webGLRenderer';


export class Engine {
  private userInput: Input;
  private renderer: WebGLRenderer;
  private scenes: Map<string, Scene>;

  constructor(options?: IEngineOptions) {
    this.renderer = new WebGLRenderer(options);
    this.scenes = new Map();
    this.userInput = new Input(options.inputHistory);

    this.userInput.attach(this.renderer.canvas());
  }

  /**
   * Create a new texture that will be handled by the engine.
   * @returns {Texture} A texture object
   */
  public newTexture(): Texture {
    return new Texture(this.renderer.context());
  }

  /**
  * Create a new spritesheet object.
  * @returns {SpriteSheet} A Spritesheet object
  */
  public newSpriteSheet(): SpriteSheet {
    return new SpriteSheet(this.renderer.context());
  }

  /**
   * Create a new scene handled by the engine.
   * @param {string} sceneName  the identifing scene name
   * @returns {Scene} a new scene handled by the engine.
   */
  public newScene(sceneName: string): Scene {
    const newScene = new Scene(this.renderer.context());
    this.scenes.set(sceneName, newScene);

    return newScene;
  }

  /**
   * Returns the scene identified by the given scene name
   * @param {string} sceneName  the identifing scene name
   * @returns {Scene} the scene by the given scene name or undefined if not found
   */
  public scene(sceneName: string): Scene | undefined {
    return this.scenes.get(sceneName);
  }

  /**
  * Render all scenes handled from the engine
  */
  public render(): void {
    this.renderer.clear();

    for (const scene of this.scenes.values()) {
      scene.render();
    }
  }

  /**
  * render only scenes given
  * @param {Scene[]}  scenes  the list of scenes to be rendered in the order given
  */
  public renderScenes(...scenes: Scene[]): void {
    for (const scene of scenes) {
      scene.render();
    }
  }

  public run(keyInput?: (events: IKeyboardEvent) => void, mouseInput?: (events: IMouseEvent) => void): void {
    let currentEvent: IEvent = this.userInput.pollEvents();

    while (currentEvent !== undefined) {
      if (currentEvent.type.includes('mouse')) {
        mouseInput(currentEvent as IMouseEvent);

      } else if (currentEvent.type.includes('key')) {
        keyInput(currentEvent as IKeyboardEvent);
      }

      currentEvent = this.userInput.pollEvents();
    }
  }
}

import Scene from '../scene';
import Texture, { SpriteSheet } from '../texture';
import { IEngineOptions, Input, IEvent } from '../engine';
import { WebGLRenderer } from './webGLRenderer';


export class Engine {
  private userInput: Input;
  private renderer: WebGLRenderer;
  private scenes: Map<string, Scene>;

  constructor(options?: IEngineOptions) {
    this.renderer = new WebGLRenderer(options);
    this.scenes = new Map();
    this.userInput = new Input();

    this.userInput.attachEventListener(this.renderer.canvas());
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

  /**
   * get notified when a keyboard event happens
   * @param keyInput  callback function taking an event type parameter, returning nothing
   */
  public keyboardEvents(keyInput: (event: IEvent) => void) {
    this.userInput.attachKeyboardListener(keyInput);
  }

  /**
   * get notified when a mouse event happens
   * @param keyInput  callback function taking an event type parameter, returning nothing
   */
  public mouseEvents(mouseInput: (event: IEvent) => void) {
    this.userInput.attachMouseListener(mouseInput);
  }

  /**
   * get notified when a controller event happens
   * @param keyInput  callback function taking an event type parameter, returning nothing
   */
  public controllerEvents(controllerInput: (events: IEvent) => void) {
    this.userInput.attachControllerListener(controllerInput);
  }

  public run(): void {
    // TODO
  }

  private simulation(step: number): void {
    // TODO
  }
}

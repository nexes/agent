import { Clock, IEngineOptions, IEvent, Input } from '../engine';
import Scene from '../scene';
import Texture, { SpriteSheet } from '../texture';
import { WebGLRenderer } from './webGLRenderer';


export class Engine {
  private frameTimeAccumulator: number;

  private userInput: Input;
  private clock: Clock;
  private renderer: WebGLRenderer;
  private scenes: Map<string, Scene>;

  constructor(options?: IEngineOptions) {
    this.renderer = new WebGLRenderer(options);
    this.clock = new Clock(options.timeStep);
    this.userInput = new Input(this.renderer.canvas());
    this.scenes = new Map();
    this.frameTimeAccumulator = 0;
  }

  /**
   * @property access the user input object
   * @readonly
   */
  public get input(): Input {
    return this.userInput;
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
   * Create a new scene handled by the engine. If the scene name already exists, it will be updated with this
   * new scene
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
      scene.initialize();
      scene.render();
    }
  }

  /**
  * render only scenes given
  * @param {Scene[]}  scenes  the list of scenes to be rendered in the order given
  */
  public renderScenes(...scenes: Scene[]): void {
    for (const scene of scenes) {
      scene.initialize();
      scene.render();
    }
  }

  public run(): void {
    for (const [name, scene] of this.scenes) {
      scene.initialize();
    }

    this.clock.start();
    requestAnimationFrame((t) => this.simulation(t));
  }

  private simulation(step: number): void {
    const frameTime = this.clock.deltaTime;
    this.frameTimeAccumulator += frameTime;

    while (this.frameTimeAccumulator >= this.clock.physicsTimeStep) {
      for (const [_, scene] of this.scenes) {
        scene.initialize();
        scene.updateSimulationStep(this.clock.physicsTimeStep);
      }

      this.frameTimeAccumulator -= this.clock.physicsTimeStep;
    }

    this.render();
    // todo cancel animation frame
    requestAnimationFrame((t) => this.simulation(t));
  }
}

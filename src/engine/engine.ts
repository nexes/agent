import Scene from '../scene';
import { IEngineOptions, Texture } from '../engine';
import { WebGLRenderer } from './webGLRenderer';


export class Engine {
	private renderer: WebGLRenderer;
	private scenes: Map<string, Scene>;

	constructor(options?: IEngineOptions) {
		this.renderer = new WebGLRenderer(options);
		this.scenes = new Map();
	}

	public newTexture(): Texture {
		return new Texture(this.renderer.context());
	}

	public newScene(sceneName: string): Scene {
		const newScene = new Scene(this.renderer.context());
		this.scenes.set(sceneName, newScene);

		return newScene;
	}

	public scene(sceneName: string): Scene | undefined {
		return this.scenes.get(sceneName);
	}

	/**
	 * Render all scenes
	 */
	public render(): void {
		this.renderer.clear();

		for (const scene of this.scenes.values()) {
			scene.render();
		}
	}

	/**
	 * render only scenes given
	 */
	public renderScenes(...scenes: Scene[]): void {
		for (const scene of scenes) {
			scene.render();
		}
	}
}

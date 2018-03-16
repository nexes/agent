import { IRenderer, IRenderOptions } from '../renderer';
import { Scene } from '../scene/scene';


export class WebGLRenderer implements IRenderer {
	private width: number;
	private height: number;
	private devicePixelRatio: number;
	private canvas: HTMLCanvasElement;
	private _glCtx: WebGLRenderingContext;

	constructor(options?: IRenderOptions) {
		this.width = 0;
		this.height = 0;
		this.devicePixelRatio = 1;
		this.canvas = null;
		this._glCtx = null;

		if (options !== undefined) {
			this.initWithOptions(options);
		}
	}

	public getContext(): WebGLRenderingContext {
		return this._glCtx;
	}

	public aspect(): number {
		return this.width / this.height;
	}

	public render(scene: Scene): void {
		this.clear();
		scene.render(this._glCtx);
	}

	public resize(width: number, height: number): void {
		this.canvas.width = this.width = width * this.devicePixelRatio;
		this.canvas.height = this.height = height * this.devicePixelRatio;

		this.canvas.style.width = this.width + 'px';
		this.canvas.style.height = this.height + 'px';

		this._glCtx.viewport(0, 0, this.width, this.height);
	}

	private clear(): void {
		this._glCtx.clear(this._glCtx.COLOR_BUFFER_BIT | this._glCtx.DEPTH_BUFFER_BIT);
	}

	private initWithOptions(options: IRenderOptions): void {
		this.width = options.width;
		this.height = options.height;
		this.devicePixelRatio = window.devicePixelRatio || 1;

		if (!options.domCanvas) {
			this.canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
			document.body.appendChild(this.canvas);

		} else {
			this.canvas = options.domCanvas;
		}

		if (options.fullscreen) {
			this.width = document.body.clientWidth;
			this.height = document.body.clientHeight;
		}

		// canvas size
		this.canvas.style.width = this.width + 'px';
		this.canvas.style.height = this.height + 'px';

		// drawing size
		this.canvas.width = this.width * this.devicePixelRatio;
		this.canvas.height = this.height * this.devicePixelRatio;

		if (!options.glContext) {
			this._glCtx = this.canvas.getContext('webgl2') as WebGLRenderingContext || this.canvas.getContext('webgl') as WebGLRenderingContext;

			if (this._glCtx === null) {
				throw new Error('glContext is null. Check WebGL compatibility');
			}

		} else {
			this._glCtx = options.glContext;
		}

		this._glCtx.viewport(0, 0, this.width, this.height);
		this._glCtx.clearColor(1.0, 0.0, 1.0, 1.0);
	}
}

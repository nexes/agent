import { IEngineOptions } from '../engine';


export class WebGLRenderer {
	private width: number;
	private height: number;
	private _devicePixelRatio: number;
	private _canvas: HTMLCanvasElement;
	private _glCtx: WebGLRenderingContext;

	constructor(options?: IEngineOptions) {
		this.width = 100;
		this.height = 100;
		this._devicePixelRatio = 1;
		this._canvas = null;
		this._glCtx = null;

		this.initWithOptions(options || {
			width: this.width,
			height: this.height,
			fullscreen: false,
		});
	}

	public context(): WebGLRenderingContext {
		return this._glCtx;
	}

	public aspect(): number {
		return this.width / this.height;
	}

	public resize(width: number, height: number): void {
		this._canvas.width = this.width = width * this._devicePixelRatio;
		this._canvas.height = this.height = height * this._devicePixelRatio;

		this._canvas.style.width = this.width + 'px';
		this._canvas.style.height = this.height + 'px';

		this._glCtx.viewport(0, 0, this.width, this.height);
	}

	public clear(): void {
		this._glCtx.clear(this._glCtx.COLOR_BUFFER_BIT | this._glCtx.DEPTH_BUFFER_BIT);
	}

	private initWithOptions(options: IEngineOptions): void {
		this.width = options.width;
		this.height = options.height;
		this._devicePixelRatio = window.devicePixelRatio || 1;

		if (!options.domCanvas) {
			this._canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
			this._canvas.style.padding = '0px';
			this._canvas.style.margin = '0px';

			document.body.style.padding = '0px';
			document.body.style.margin = '0px';
			document.body.style.overflow = 'hidden';
			document.body.appendChild(this._canvas);

		} else {
			this._canvas = options.domCanvas;
		}

		if (options.fullscreen) {
			this.width = window.innerWidth;
			this.height = window.innerHeight;
		}

		// canvas size
		this._canvas.style.width = this.width + 'px';
		this._canvas.style.height = this.height + 'px';

		// drawing size
		this._canvas.width = this.width * this._devicePixelRatio;
		this._canvas.height = this.height * this._devicePixelRatio;

		if (!options.glContext) {
			// TODO: handle rendering2Context
			this._glCtx = this._canvas.getContext('webgl2') as WebGLRenderingContext || this._canvas.getContext('webgl') as WebGLRenderingContext;

			if (this._glCtx === null) {
				throw new Error('glContext is null. Check WebGL compatibility');
			}

		} else {
			this._glCtx = options.glContext;
		}

		this._glCtx.enable(this._glCtx.CULL_FACE);
		this._glCtx.enable(this._glCtx.BLEND);
		this._glCtx.disable(this._glCtx.DEPTH_TEST);

		this._glCtx.blendFunc(this._glCtx.SRC_ALPHA, this._glCtx.ONE_MINUS_SRC_ALPHA);
		this._glCtx.cullFace(this._glCtx.FRONT);
		this._glCtx.viewport(0, 0, this.width, this.height);
		this._glCtx.clearColor(1.0, 0.0, 1.0, 1.0);
	}
}


export interface IRenderer {
	aspect(): number;
	render(): void;
	clear(): void;
	resize(x: number, y: number): void;
}

export interface IRenderOptions {
	width: number;
	height: number;
	domCanvas?: HTMLCanvasElement;
	glContext?: WebGLRenderingContext;
}

export class WebGLRenderer implements IRenderer {
	private _width: number;
	private _height: number;
	private canvas: HTMLCanvasElement;
	private _glContext: WebGLRenderingContext;

	constructor() {
		this._width = 0;
		this._height = 0;
		this.canvas = null;
		this._glContext = null;
	}

	public initWithOptions(options: IRenderOptions): void {
		this._width = options.width;
		this._height = options.height;

		if (!options.domCanvas) {
			this.canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
			document.body.appendChild(this.canvas);

		} else {
			this.canvas = options.domCanvas;
		}

		if (!options.glContext) {
			this._glContext = this.canvas.getContext('webgl2') as WebGLRenderingContext || this.canvas.getContext('webgl') as WebGLRenderingContext;

			if (this._glContext === null) {
				throw new Error('glContext is null. Check WebGL compatibility');
			}

		} else {
			this._glContext = options.glContext;
		}

		this.canvas.width = this._width;
		this.canvas.height = this._height;
		this._glContext.viewport(0, 0, this._width, this._height);
		this._glContext.clearColor(0.5, 0.5, 0.5, 1.0);
	}

	public aspect(): number {
		return this._width / this._height;
	}

	public clear(): void {
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT | this._glContext.DEPTH_BUFFER_BIT);
	}

	public render(): void {
		// TODO
	}

	public resize(width: number, height: number): void {
		this.canvas.width = this._width = width;
		this.canvas.height = this._height = height;

		this._glContext.viewport(0, 0, this._width, this._height);
	}
}

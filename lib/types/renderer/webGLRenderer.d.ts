import { IRenderer, IRenderOptions } from '../renderer';
import { Scene } from '../scene/scene';
export declare class WebGLRenderer implements IRenderer {
    private width;
    private height;
    private devicePixelRatio;
    private canvas;
    private _glCtx;
    constructor(options?: IRenderOptions);
    getContext(): WebGLRenderingContext;
    aspect(): number;
    render(scene: Scene): void;
    resize(width: number, height: number): void;
    private clear();
    private initWithOptions(options);
}

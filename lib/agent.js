(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Agent"] = factory();
	else
		root["Agent"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vector2_1 = __webpack_require__(2);
exports.Vector2 = vector2_1.Vector2;
var vector3_1 = __webpack_require__(6);
exports.Vector3 = vector3_1.Vector3;
var matrix4_1 = __webpack_require__(7);
exports.Matrix4 = matrix4_1.Matrix4;
var Axis;
(function (Axis) {
    Axis[Axis["X"] = 0] = "X";
    Axis[Axis["Y"] = 1] = "Y";
    Axis[Axis["Z"] = 2] = "Z";
})(Axis = exports.Axis || (exports.Axis = {}));
function toRadian(deg) {
    const rad = (deg / 360) * 2 * Math.PI;
    return parseFloat(rad.toFixed(5));
}
exports.toRadian = toRadian;
function toDegree(rad) {
    return Math.round((rad / (2 * Math.PI)) * 360);
}
exports.toDegree = toDegree;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const math_1 = __webpack_require__(0);
var ShaderType;
(function (ShaderType) {
    ShaderType[ShaderType["Vertex"] = WebGLRenderingContext.VERTEX_SHADER] = "Vertex";
    ShaderType[ShaderType["Fragment"] = WebGLRenderingContext.FRAGMENT_SHADER] = "Fragment";
})(ShaderType = exports.ShaderType || (exports.ShaderType = {}));
class Shader {
    constructor() {
        this.shaderData = null;
        this.vertAttributes = new Map();
    }
    setShaderData(gl, type, code) {
        const tempAttr = [];
        const tempUniform = [];
        const tempVarying = [];
        const lines = code.split('\n');
        const id = this.compileSource(gl, type, code);
        for (const line of lines) {
            const endIndex = line.charAt(line.length - 1) === ';' ? line.length - 1 : line.length;
            const varName = line.substring(line.lastIndexOf(' ') + 1, endIndex);
            if (line.search(/^\s*(attribute)/gi) !== -1) {
                tempAttr.push({
                    name: varName,
                    id: -1,
                });
            }
            else if (line.search(/^\s*(uniform)/gi) !== -1) {
                tempUniform.push({
                    name: varName,
                    id: 0,
                });
            }
            else if (line.search(/^\s*(varying)/gi) !== -1) {
                tempVarying.push({
                    name: varName,
                    id: 0,
                });
            }
        }
        this.shaderData = {
            id,
            type,
            code,
            attributes: tempAttr,
            uniforms: tempUniform,
            varyings: tempVarying,
        };
    }
    get ID() {
        return this.shaderData.id;
    }
    get Attributes() {
        return this.shaderData.attributes;
    }
    get Uniforms() {
        return this.shaderData.uniforms;
    }
    get Varyings() {
        return this.shaderData.varyings;
    }
    getVertexAttribFor(attName) {
        return this.vertAttributes.get(attName);
    }
    setVertexAttribFor(attName, attribute) {
        const attrs = this.shaderData.attributes;
        const aLoc = attrs.filter((attrib) => attrib.name === attName);
        if (aLoc.length === 0) {
            throw new ReferenceError(`setVertexAttrib: ${attName} was not found`);
        }
        this.vertAttributes.set(attName, attribute);
    }
    setUniform(gl, uniformName, data) {
        const uniforms = this.shaderData.uniforms;
        const uLoc = uniforms.filter((uniform) => uniform.name === uniformName);
        if (uLoc.length === 0) {
            throw new ReferenceError(`setUniform: ${uniformName} was not found`);
        }
        if (data instanceof math_1.Matrix4) {
            gl.uniformMatrix4fv(uLoc[0].id, false, data.flatten());
        }
        else if (data instanceof Float32Array) {
            const len = data.length;
            switch (len) {
                case 2:
                    gl.uniform2fv(uLoc[0].id, data);
                case 3:
                    gl.uniform3fv(uLoc[0].id, data);
                case 4:
                    gl.uniform4fv(uLoc[0].id, data);
            }
        }
        else if (typeof data === 'number') {
            gl.uniform1f(uLoc[0].id, data);
        }
        else {
            throw new TypeError('setUniform: data passed is not a valid type');
        }
    }
    compileSource(gl, type, source) {
        const shaderID = gl.createShader(type);
        gl.shaderSource(shaderID, source);
        gl.compileShader(shaderID);
        if (!gl.getShaderParameter(shaderID, gl.COMPILE_STATUS)) {
            console.log(`Shader COMPILE_STATUS error: ${gl.getShaderInfoLog(shaderID)}`);
        }
        return shaderID;
    }
}
exports.Shader = Shader;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.z = 0;
    }
    add(vec) {
        return new Vector2(vec.x + this.x, vec.y + this.y);
    }
    sub(vec) {
        return new Vector2(this.x - vec.x, this.y - vec.y);
    }
    mult(vec) {
        return new Vector2(this.x * vec.x, this.y * vec.y);
    }
    div(vec) {
        if (vec.x === 0 || vec.y === 0) {
            throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y}`);
        }
        return new Vector2(this.x / vec.x, this.y / vec.y);
    }
    dot(vec) {
        return (this.x * vec.x) + (this.y * vec.y);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    scale(scaler) {
        return new Vector2(this.x * scaler, this.y * scaler);
    }
    normalize() {
        const l = this.length();
        return new Vector2(this.x / l, this.y / l);
    }
    flatten() {
        return new Float32Array([this.x, this.y]);
    }
}
exports.Vector2 = Vector2;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var square_1 = __webpack_require__(4);
exports.Square = square_1.Square;
var scene_1 = __webpack_require__(5);
exports.Scene = scene_1.Scene;
var shader_1 = __webpack_require__(1);
exports.Shader = shader_1.Shader;
exports.ShaderType = shader_1.ShaderType;
var renderer_1 = __webpack_require__(8);
exports.WebGLRenderer = renderer_1.WebGLRenderer;
__export(__webpack_require__(0));


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Square {
    constructor(x, y, width, height) {
        this.bufferId = null;
        this.vbo = new Float32Array(24);
        this.vbo[0] = x;
        this.vbo[1] = y;
        this.vbo[2] = 0;
        this.vbo[3] = 0;
        this.vbo[4] = 0;
        this.vbo[5] = 0;
        this.vbo[6] = x + width;
        this.vbo[7] = y;
        this.vbo[8] = 0;
        this.vbo[9] = 0;
        this.vbo[10] = 0;
        this.vbo[11] = 0;
        this.vbo[12] = x;
        this.vbo[13] = y + height;
        this.vbo[14] = 0;
        this.vbo[15] = 0;
        this.vbo[16] = 0;
        this.vbo[17] = 0;
        this.vbo[18] = x + width;
        this.vbo[19] = y + height;
        this.vbo[20] = 0;
        this.vbo[21] = 0;
        this.vbo[22] = 0;
        this.vbo[23] = 0;
    }
    setColor(r, g, b, a) {
        for (let i = 2; i < this.vbo.length; i += 2) {
            this.vbo[i++] = r % 256;
            this.vbo[i++] = g % 256;
            this.vbo[i++] = b % 256;
            this.vbo[i++] = a % 256;
        }
    }
    setTexture() {
        throw new Error('Method not implemented.');
    }
    vertexAttributes() {
        return {
            size: 2,
            normalized: false,
            stride: 24,
            offset: 0,
        };
    }
    colorAttributes() {
        return {
            size: 4,
            normalized: false,
            stride: 24,
            offset: 8,
        };
    }
    bindBuffer(gl) {
        if (this.bufferId === null) {
            this.bufferId = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferId);
        gl.bufferData(gl.ARRAY_BUFFER, this.vbo, gl.STATIC_DRAW);
    }
}
exports.Square = Square;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const shader_1 = __webpack_require__(1);
class Scene {
    constructor() {
        this.shaders = new Map();
        this.renderables = [];
        this.programId = null;
        this.programLinked = false;
    }
    addDrawable(...item) {
        this.renderables.push(...item);
    }
    preRender(gl) {
        if (!this.programLinked) {
            this.programLinked = true;
            gl.linkProgram(this.programId);
        }
        for (const shaderData of this.shaders.values()) {
            const attrs = shaderData.Attributes;
            for (const att of attrs) {
                if (att.id === -1) {
                    att.id = gl.getAttribLocation(this.programId, att.name);
                }
                const vertAttrib = shaderData.getVertexAttribFor(att.name);
                if (vertAttrib !== undefined) {
                    gl.enableVertexAttribArray(att.id);
                    gl.vertexAttribPointer(att.id, vertAttrib.size, gl.FLOAT, vertAttrib.normalized, vertAttrib.stride, vertAttrib.offset);
                }
                else {
                }
            }
        }
        if (!gl.getProgramParameter(this.programId, gl.LINK_STATUS)) {
            console.log(`Error LINK_STATUS program Id ${gl.getProgramInfoLog(this.programId)}`);
        }
        gl.useProgram(this.programId);
    }
    render(gl) {
        for (const gObject of this.renderables) {
            gObject.bindBuffer(gl);
            this.preRender(gl);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }
    addShader(gl, type, data) {
        const newShader = new shader_1.Shader();
        if (this.programId === null) {
            this.programId = gl.createProgram();
        }
        newShader.setShaderData(gl, type, data);
        gl.attachShader(this.programId, newShader.ID);
        this.shaders.set(type, newShader);
    }
    shader(shader) {
        if (!this.shaders.has(shader)) {
            throw new Error(`Scene does not have shader type ${shader} assigned`);
        }
        return this.shaders.get(shader);
    }
}
exports.Scene = Scene;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    add(vec) {
        return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
    }
    sub(vec) {
        return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    div(vec) {
        if (vec.x === 0 || vec.y === 0 || vec.z === 0) {
            throw new TypeError(`Can not divide by zero x:${vec.x} y:${vec.y} z: ${vec.z}`);
        }
        return new Vector3(this.x / vec.x, this.y / vec.y, this.z / vec.z);
    }
    mult(vec) {
        return new Vector3(this.x * vec.x, this.y * vec.y, this.z * vec.z);
    }
    dot(vec) {
        return (this.x * vec.x) + (this.y * vec.y) + (this.z * vec.z);
    }
    scale(scaler) {
        return new Vector3(this.x * scaler, this.y * scaler, this.z * scaler);
    }
    normalize() {
        const l = this.length();
        return new Vector3(this.x / l, this.y / l, this.z / l);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z));
    }
    flatten() {
        return new Float32Array([this.x, this.y, this.z]);
    }
}
exports.Vector3 = Vector3;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = __webpack_require__(2);
const math_1 = __webpack_require__(0);
class Matrix4 {
    constructor(arr) {
        if (arr !== undefined && arr.length === 16) {
            this.data = arr.map((value) => value);
        }
        else {
            this.data = new Float32Array(16);
            this.data[0] = 1;
            this.data[5] = 1;
            this.data[10] = 1;
            this.data[15] = 1;
        }
    }
    setAsIdentity() {
        this.data.fill(0);
        this.data[0] = 1;
        this.data[5] = 1;
        this.data[10] = 1;
        this.data[15] = 1;
    }
    scale(scaler) {
        let x = 1;
        let y = 1;
        let z = 1;
        const _mat = new Matrix4(this.data);
        if (typeof scaler === 'object') {
            x = scaler.x;
            y = scaler.y;
            z = scaler.z || 1;
        }
        else {
            x = scaler;
            y = scaler;
            z = scaler;
        }
        _mat.data[0] *= x;
        _mat.data[5] *= y;
        _mat.data[10] *= z;
        return _mat;
    }
    translate(vec) {
        let x = 0;
        let y = 0;
        let z = 0;
        const _mat = new Matrix4(this.data);
        if (vec instanceof vector2_1.Vector2) {
            x = vec.x;
            y = vec.y;
            z = 0;
        }
        else {
            x = vec.x;
            y = vec.y;
            z = vec.z || 0;
        }
        _mat.data[12] += x;
        _mat.data[13] += y;
        _mat.data[14] += z;
        return _mat;
    }
    rotate(theta, axis) {
        const _mat = new Matrix4(this.data);
        switch (axis) {
            case math_1.Axis.X:
                _mat.data[5] *= Math.cos(theta);
                _mat.data[6] *= Math.sin(theta);
                _mat.data[9] *= -(Math.sin(theta));
                _mat.data[10] *= Math.cos(theta);
                break;
            case math_1.Axis.Y:
                _mat.data[0] *= Math.cos(theta);
                _mat.data[2] *= -(Math.sin(theta));
                _mat.data[8] *= Math.sin(theta);
                _mat.data[10] *= Math.cos(theta);
                break;
            case math_1.Axis.Z:
                _mat.data[0] *= Math.cos(theta);
                _mat.data[1] *= Math.sin(theta);
                _mat.data[4] *= -(Math.sin(theta));
                _mat.data[5] *= Math.cos(theta);
                break;
        }
        return _mat;
    }
    flatten() {
        return this.data;
    }
}
exports.Matrix4 = Matrix4;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var webGLRenderer_1 = __webpack_require__(9);
exports.WebGLRenderer = webGLRenderer_1.WebGLRenderer;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WebGLRenderer {
    constructor(options) {
        this.width = 0;
        this.height = 0;
        this.devicePixelRatio = 1;
        this.canvas = null;
        this._glCtx = null;
        if (options !== undefined) {
            this.initWithOptions(options);
        }
    }
    getContext() {
        return this._glCtx;
    }
    aspect() {
        return this.width / this.height;
    }
    render(scene) {
        this.clear();
        scene.render(this._glCtx);
    }
    resize(width, height) {
        this.canvas.width = this.width = width * this.devicePixelRatio;
        this.canvas.height = this.height = height * this.devicePixelRatio;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this._glCtx.viewport(0, 0, this.width, this.height);
    }
    clear() {
        this._glCtx.clear(this._glCtx.COLOR_BUFFER_BIT | this._glCtx.DEPTH_BUFFER_BIT);
    }
    initWithOptions(options) {
        this.width = options.width;
        this.height = options.height;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        if (!options.domCanvas) {
            this.canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            document.body.appendChild(this.canvas);
        }
        else {
            this.canvas = options.domCanvas;
        }
        if (options.fullscreen) {
            this.width = document.body.clientWidth;
            this.height = document.body.clientHeight;
        }
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
        this.canvas.width = this.width * this.devicePixelRatio;
        this.canvas.height = this.height * this.devicePixelRatio;
        if (!options.glContext) {
            this._glCtx = this.canvas.getContext('webgl2') || this.canvas.getContext('webgl');
            if (this._glCtx === null) {
                throw new Error('glContext is null. Check WebGL compatibility');
            }
        }
        else {
            this._glCtx = options.glContext;
        }
        this._glCtx.viewport(0, 0, this.width, this.height);
        this._glCtx.clearColor(1.0, 0.0, 1.0, 1.0);
    }
}
exports.WebGLRenderer = WebGLRenderer;


/***/ })
/******/ ]);
});
//# sourceMappingURL=agent.js.map
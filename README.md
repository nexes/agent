# Agent
### A 2d game engine written using TypeScript and WebGL

#### What
This is designed to be a simple 2d game engine that is easy to use and light weight.

### Why
This is a project I've always wanted to do, to better learn how to design and implement a large system. To learn how engines work and peak behind the curtain. This is not designed to be the end all be all of WebGL engines, just a personal project I'm passionate about.

## Compile and Build
*npm run compile*: this will create the ./compilejs folder. This will include the compiled js and the typescript .d.ts files. Change the tsconfig.json file to make changes to the compile output.

*npm run build*: this will use webpack to collect the js files from the compile stage and output a minified and non minified version in the newly created ./lib folder, along with the Typescript type files

## Usage
After compiling and building you will have an agent.js and agent.min.js file. Include this in a HTML `script` or import into a js file.

```html
<script type="application/javascript" src="agent.min.js"></script>
```

```javascript
  const simpleVertexShader = `
    attribute vec2 aPos;
    attribute vec2 aTexture;
    uniform mat4 camera;

    varying vec2 vTexture;

    void main() {
      vTexture = aTexture;
      gl_Position = camera * vec4(aPos, 0.0, 1.0);
    }
  `;
  const simpleFragmentShader = `
    precision mediump float;

    uniform sampler2D uSampler;
    varying vec2 vTexture;

    void main() {
      gl_FragColor = texture2D(uSampler, vTexture);
    }
  `;

function setup() {
  let engine = new Agent.Engine({width: 1200, height: 800});
  let camera = new Agent.OrthographicCamera({left:0, right:1200, top:0, bottom:800, far:0, near:100});

  // A mesh is a 2d grid of Tiles
  let brickBackground = new Agent.Mesh(0, 0, {rowLength: 20, columnLength: 15, width: 64, height: 64});

  // A scene is responsible for all the renderable objects and the camera you give it. Different scenes can hold different objects and cameras
  let scene = engine.newScene('worldscene');

  // Lets create a texute to map to our mesh object
  let brickTexture = engine.newTexture();

  // lets load the image resource
  brickTexture.loadResource("./images/bricktexture.png")
    .then((success) => {
      // and assign the resource to our renderable object
      brickBackground.setTexture(brickTexture);
    })
    .catch((success) => {
      console.log('tilemap.html, error loading texture');
    });

  // Lets setup our shaders. The engine (right now) wont create shaders for you, you will write your own shadders and the engine will parse them
  scene.addShader(Agent.ShaderType.Vertex, simpleVertexShader);
  scene.addShader(Agent.ShaderType.Fragment, simpleFragmentShader);

  // Lets tell our engine want value we want those shader variables to hold
  scene.shader(Agent.ShaderType.Vertex).setUniformDataFor('camera', { UUID: 'some-id', uniformMatrix: camera.matrix() });
  scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor('aPos', { vertexAttribute: brickBackground.vertexAttributes() });
  scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor('aTexture', { vertexAttribute: brickBackground.textureAttributes() });

  // lets add our drawables to the scene and the camera, then call render() or run()
  scene.addDrawable(brickBackground);
  scene.addCamera(camera);
  engine.run();
  // call engine.render() will render once, without a the game loop starting
}
```

### Please be aware
This is a work in progress project and is by no means done. Here are some of the things I'm still working on.
* Finalize camera movement
  * camera shake using Perlin noise
  * follow a moveable object
  * better camera rotation
* Audio
  * persistent background music
  * sfx
* AABB collision and a physics system
* Network code and multiplayer ability
* Save and load state/game. Serialization.
* Font
  * load ttf files or handle fonts as sprites
  * font animations like a typewritter effect
* User input
  * add controller support
  * rethink design to be more robust

* Documentation for the engines API

## License
MIT
// @ts-nocheck
const vshr = `
attribute vec2 aPos;
attribute vec2 aText;
uniform mat4 camera;

varying vec2 vTexture;

void main() {
  vTexture = aText;
  gl_Position = camera * vec4(aPos, 0.0, 1.0);
}
`;

const fshr = `
precision mediump float;

uniform sampler2D uSampler;
varying vec2 vTexture;

void main() {
  gl_FragColor = texture2D(uSampler, vTexture);
}
`;

function runExample() {
  let engine = new Agent.Engine({width: 1200, height: 880});
  let background = new Agent.Mesh(0, 0, {rowLength: 10, columnLength: 10, width: 128, height: 128});
  let camera = new Agent.OrthographicCamera(0, 0, 800, 600);
  let myShader = new Agent.Shader();

  let tile = new Agent.Tile(10, 10, 64, 64);

  let scene = engine.newScene("worldScene");
  let worldSpriteSheet = engine.newSpriteSheet();
  let leveldata = Agent.stringToTextureJSON(JSON.stringify(levelOne));

  worldSpriteSheet.loadResourceWithData("../images/groundtilesheet.png", leveldata)
    .then((success) => {
      background.setSpriteSheet(worldSpriteSheet); // assign our texture to a renderable
    })
    .catch((success) => {
      console.log("world spritesheet failed to load");
    });


  myShader.setSource(vshr, fshr);
  myShader.setUniformData("camera", camera.uniform);
  myShader.setAttributeData("aPos", [ background.vertexAttributes(), tile.vertexAttributes() ]);
  myShader.setAttributeData("aText", background.textureAttributes());

  engine.input.keyDownEvent((e) => {
    if (e.key === "s") {
      camera.effect.shake(500, 8)
        .then(async () => {
          console.log("shake animation is done");

        }).catch((error) => {
          console.log("animationm error ", error);
        });
    }
  });

  scene.setShader(myShader);
  scene.addDrawable(background, tile);
  scene.addCamera(camera);
  engine.run();
}

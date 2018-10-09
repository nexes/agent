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
  const engine = new Agent.Engine({width: 1200, height: 800});
  const camera = new Agent.OrthographicCamera(0, 0, 1200, 800);
  const hero = new Agent.Tile(10, 0, 24, 24);
  const fire = new Agent.Tile(30, 0, 24, 24);
  let myShader = new Agent.Shader();

  const scene = engine.newScene("worldScene");
  const heroSpriteSheet = engine.newSpriteSheet();
  const fireSpriteSheet = engine.newSpriteSheet();


  fireSpriteSheet.loadResource("../images/firesprite.png")
    .then((textureID) => {
      fire.setSprite("burning", textureID, fireSpriteSheet.generateSprite(16, 16, {
        x: 0,
        y: 0,
        width: 64,
        height: 64,
        column: 4,
        row: 4,
      }));
    })
    .catch((e) => {
      console.log("error loading firesprite");
    });

  heroSpriteSheet.loadResource("../images/herosprite.png")
    .then((textureID) => {
      hero.setSprite("walking_right", textureID, heroSpriteSheet.generateSprite(6, 6, {
        x: 32 * 4,
        y: 0,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_left", textureID, heroSpriteSheet.generateSprite(6, 6, {
        x: 0,
        y: 32,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_up", textureID, heroSpriteSheet.generateSprite(4, 4, {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_down", textureID, heroSpriteSheet.generateSprite(6, 6, {
        x: 32 * 10,
        y: 0,
        width: 32,
        height: 32,
      }));
    })
    .catch((e) => {
      console.log("error loading sprite resource");
    });


  myShader.setSource(vshr, fshr);
  myShader.setUniformData("camera", camera.uniform);
  myShader.setAttributeData("aPos", [ hero.vertexAttributes(), fire.vertexAttributes() ]);
  myShader.setAttributeData("aText", [ hero.textureAttributes(), fire.textureAttributes()]);


  camera.translate(new Agent.Vector2(10, 10));
  camera.scale(4);

  scene.setShader(myShader);
  scene.addDrawable(hero, fire);
  scene.addCamera(camera);

  const panVec = new Agent.Vector2(160, 160);
  const panVec2 = new Agent.Vector2(-160, -160);
  const panVec3 = new Agent.Vector2(160, 0);
  const panVec4 = new Agent.Vector2(-80, 80);

  engine.input.keyDownEvent((e) => {
    if (e.key === "d") {

      camera.effect.pan(panVec, 1000)
        .then(async () => {
          // now we're done, we can do another one to pan back
          console.log("pan1 animation is done");

          await camera.effect.pan(panVec2, 1000);
          console.log("pan2 is done");

          await camera.effect.pan(panVec3, 1000);
          console.log("pan3 is done");

          camera.effect.pan(panVec4, 1000);
          console.log("pan4 is done");

          await camera.effect.zoom(8, 2000, true);
          console.log("zoom1 is done");

          await camera.effect.zoom(2, 3000);
          console.log("zoom1 is done");

        }).catch((error) => {
          console.log("animationm error ", error);
        });
    }
  });

  engine.input.mouseDownEvent((e) => {
    if (e.type === "mousedown") {
      console.log("mouse downn event: ", e);
    }
  });

  engine.run();
}

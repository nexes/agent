// @ts-nocheck
// tslint:disable:no-console
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
  const camera = new Agent.OrthographicCamera({left: 0, right: 1200, top: 0, bottom: 800, far: 0, near: 100});
  const hero = new Agent.Tile(100, 00, 42, 42);
  const hero2 = new Agent.Tile(400, 200, 42, 42);

  const scene = engine.newScene("worldScene");
  const heroSpriteSheet = engine.newSpriteSheet();

  // hero.addComponent(new Agent.MovementComponent());
  // hero.addComponent(new Agent.CollisionComponent());

  heroSpriteSheet.loadResource("../images/herosprite.png")
    .then((success) => {
      hero.setSprite("walking_right", heroSpriteSheet.generateSprite(6, 6, {
        x: 32 * 4,
        y: 0,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_left", heroSpriteSheet.generateSprite(6, 6, {
        x: 0,
        y: 32,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_up", heroSpriteSheet.generateSprite(4, 4, {
        x: 0,
        y: 0,
        width: 32,
        height: 32,
      }));

      hero.setSprite("walking_down", heroSpriteSheet.generateSprite(6, 6, {
        x: 32 * 10,
        y: 0,
        width: 32,
        height: 32,
      }));

      hero2.setSprite("walking_left", heroSpriteSheet.generateSprite(6, 12, {
        x: 0,
        y: 32,
        width: 32,
        height: 32,
      }));
    })
    .catch((success) => {
      console.log("error loading sprite resource");
    });

  scene.addShader(Agent.ShaderType.Vertex, vshr);
  scene.addShader(Agent.ShaderType.Fragment, fshr);

  scene.shader(Agent.ShaderType.Vertex).setUniformDataFor("camera", { dataMatrix: camera.matrix() });
  scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor("aPos", [
    { vertexAttribute: hero.vertexAttributes() },
    { vertexAttribute: hero2.vertexAttributes() },
  ]);

  scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor("aText", [
    { vertexAttribute: hero.textureAttributes() },
    { vertexAttribute: hero2.textureAttributes() },
  ]);

  scene.addDrawable(hero, hero2);
  scene.addCamera(camera);

  // this will hold a transform matrix, and will be multiplied with dt during our simulation, only update dirty objects
  // hero.component(Agent.Component.Movement).transfrom(new Agent.Vec2(5, 0));
  engine.keyboardEvents((e) => {
    if (e.type === "keydown" && e.key === "d") {
      hero.setActiveSprite("walking_right");

    } else if (e.type === "keydown" && e.key === "a") {
      hero.setActiveSprite("walking_left");

    } else if (e.type === "keydown" && e.key === "w") {
      hero.setActiveSprite("walking_up");

    } else if (e.type === "keydown" && e.key === "s") {
      hero.setActiveSprite("walking_down");
    }
  });

  engine.mouseEvents((e) => {
    if (e.type === "mousedown") {
      console.log("mouse downn event: ", e);
    }
  });

  engine.run();
}

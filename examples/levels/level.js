// @ts-nocheck

function runExample() {
  let engine = new Agent.Engine({width: 1200, height: 880});
  let background = new Agent.Mesh(0, 0, {rowLength: 10, columnLength: 10, width: 128, height: 128});
  let camera = new Agent.OrthographicCamera(0, 0, 800, 600);

  let tile = new Agent.Tile(10, 10, 64, 64);

  let scene = engine.newScene("worldScene");
  let worldSpriteSheet = engine.newSpriteSheet();
  let leveldata = Agent.stringToTextureJSON(JSON.stringify(levelOne));

  worldSpriteSheet.loadResourceWithData("../images/groundtilesheet.png", leveldata)
    .then(() => {
      background.setSpriteSheet(worldSpriteSheet); // assign our texture to a renderable
    })
    .catch(() => {
      console.log("world spritesheet failed to load");
    });

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

  scene.addDrawable(background, tile);
  scene.addCamera(camera);
  engine.run();
}

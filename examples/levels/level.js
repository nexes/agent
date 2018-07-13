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
	let engine = new Agent.Engine({width: 1200, height: 800});
	let background = new Agent.Mesh(0, 0, {rowLength: 10, columnLength: 10, width: 64, height: 64});
	let camera = new Agent.OrthographicCamera({left:0, right:1280, top:0, bottom:1280, far:0, near:100});

	let scene = engine.newScene('worldScene');
	let worldSpriteSheet = engine.newSpriteSheet();
	let leveldata = Agent.stringToTextureJSON(JSON.stringify(levelOne));

	worldSpriteSheet.loadResourceWithData("../images/groundtilesheet.png", leveldata)
		.then((success) => {
			background.setSpriteSheet(worldSpriteSheet); // assign our texture to a renderable
			engine.render();					// re-render since we are not running in a loop
		})
		.catch((success) => {
			console.log('world spritesheet failed to load');
		});

	scene.addShader(Agent.ShaderType.Vertex, vshr);
	scene.addShader(Agent.ShaderType.Fragment, fshr);

	scene.shader(Agent.ShaderType.Vertex).setUniformDataFor('camera', { dataMatrix: camera.matrix() });
	scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor('aPos', { vertexAttribute: background.vertexAttributes() });
	scene.shader(Agent.ShaderType.Vertex).setAttributeDataFor('aText', { vertexAttribute: background.textureAttributes() });

	scene.addDrawable(background);
	scene.addCamera(camera);
	engine.render();
}

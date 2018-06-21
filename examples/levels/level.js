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
	let background = new Agent.Mesh(100, 100, 1000, 400, {singleTileWidth: 64, singleTileHeight: 64});
	let camera = new Agent.OrthographicCamera({left:0, right:1200, top:0, bottom:800, far:0, near:100});

	let scene = engine.newScene('worldScene');
	let fireTexture = engine.newTexture();
	let leveldata = Agent.stringToTextureJSON(JSON.stringify(levelOne));

	console.log(leveldata);

	fireTexture.loadResource("../images/groundtilesheet.png")
		.then((success) => {
			background.setTextureFromJSON(fireTexture, leveldata); // assign our texture to a renderable
			engine.render();					// re-render since we are not running in a loop
		})
		.catch((success) => {
			console.log('fire texture failed to load');
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

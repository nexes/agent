export const defaultVertexSource = `
attribute vec2 aPosition;
attribute vec2 aTexture;
attribute vec3 aColor;
uniform mat4 camera;
uniform mat4 modelview;

varying vec2 vTexture;
varying vec3 vColor;

void main() {
  vTexture = aText;
  vColor = aColor;

  gl_Position = camera * modelview * vec4(aPos, 0.0, 1.0);
}
`;

export const defaultFragmentSource = `
precision mediump float;

uniform sampler2D uSampler;
uniform float alpha;

varying vec2 vTexture;
varying vec3 vColor;

void main() {
  vec4 textureColor = texture2D(uSampler, vTexture);
  gl_FragColor = vec4(textureColor.rbg * vColor, textureColor.a * alpha);
}
`;
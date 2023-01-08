uniform float time;
uniform float distanceFromCenter;//0～1（アクティブな要素は1、非アクティブは0）

varying vec2 vUv;
float PI = 3.1415192653589793238;

void main() {
  vUv = (uv - vec2(0.5)) * (1.0 - 0.2 * distanceFromCenter * (2. * distanceFromCenter)) + vec2(0.5);

  vec3 pos = position;
  pos.y += sin(PI * uv.x) * 0.02;
  pos.z += sin(PI * uv.x) * 0.03;

  pos.y += sin(time * 0.3) * 0.01;

  vUv.y -= sin(time * 0.3) * 0.02;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(pos, 1.0);
}
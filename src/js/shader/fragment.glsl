uniform sampler2D texture1;
uniform float time;
uniform float distanceFromCenter;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  vec4 t = texture2D(texture1, uv);
  float bw = (t.r + t.b + t.g) / 3.;
  vec4 another = vec4(bw,bw,bw,1.);
  gl_FragColor = mix(another,t,distanceFromCenter);
  gl_FragColor.a = clamp(distanceFromCenter, 0.2, 1.);

}
import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shader/vertex.glsl";
import fragmentShader from "./shader/fragment.glsl";
import * as dat from "lil-gui";

export class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1);
    this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.clock = new THREE.Clock();
    this.textureLoader = new THREE.TextureLoader();

    this.container.appendChild(this.renderer.domElement);

    const fov = 70;
    const fovRad = (fov / 2) * (Math.PI / 180);
    // const dist = sizes.height / 2 / Math.tan(fovRad); //画面いっぱいにオブジェクトを映す場合
    this.camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.isPlaying = true;

    // this.settings();
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    this.materials = [];
    this.meshes = [];
    this.groups = [];
    this.handleImages();
  }

  handleImages() {
    const images = [...document.querySelectorAll("img")];
    images.forEach((im, i) => {
      const mat = this.material.clone();
      this.materials.push(mat);
      const group = new THREE.Group();
      mat.uniforms.texture1.value = this.textureLoader.load(im.src);
      mat.uniforms.texture1.value.needsUpdate = true;
      const geo = new THREE.PlaneGeometry(1.5, 1, 20, 20);
      const mesh = new THREE.Mesh(geo, mat);

      group.add(mesh);
      this.groups.push(group);
      // console.log(this.groups);
      this.scene.add(group);
      this.meshes.push(mesh);
      mesh.position.y = i * 1.2;

      group.rotation.y = -0.5;
      group.rotation.x = -0.3;
      group.rotation.z = -0.1;
    });
  }

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives:",
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {
          value: 0,
        },
        distanceFromCenter: {
          value: 0,
        },
        texture1: {
          value: null,
        },
        resolution: {
          value: new THREE.Vector4(),
        },
        uvRate1: {
          value: new THREE.Vector2(1, 1),
        },
      },
      transparent:true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });

    // this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    // this.plane = new THREE.Mesh(this.geometry, this.material);
    // this.scene.add(this.plane);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if (!this.isPlaying) {
      this.render();
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) {
      return;
    }
    if (this.materials) {
      this.materials.forEach((m) => {
        m.uniforms.time.value = this.time;
      });
    }
    const elapsedTime = this.clock.getElapsedTime();
    this.time = elapsedTime;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

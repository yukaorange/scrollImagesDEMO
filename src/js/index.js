import { Sketch } from "./webgl";
import { gsap } from "gsap";

const sketch = new Sketch({
  dom: document.querySelector("#container"),
});

let attractMode = false;
let attractTo = 0;
let speed = 0;
let position = 0;
let rounded = 0;

const block = document.querySelector("#block");
const wrap = document.querySelector("#wrap");
let elems = [...document.querySelectorAll(".n")];

//マウスホイール
window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.0003;
});

// let objs = Array(5).fill({ dist: 0 });
const elemsLength = elems.length;
let objs = Array(elemsLength).fill({ dist: 0 });

//タッチパネル
if ("ontouchstart" in window) {
  let previousTouchY = 0;
  window.addEventListener("touchstart", (e) => {
    previousTouchY = e.touches[0].clientY;
  });
  window.addEventListener("touchmove", (e) => {
    e.preventDefault(); // 画面スクロールを防止

    // const maxScrollTop =
    //   document.documentElement.scrollHeight - window.innerHeight;
    // const scrollTop = document.documentElement.scrollTop;
    // if (scrollTop < 0) {
    //   // スクロール位置が上端よりも小さい場合
    //   document.documentElement.scrollTop = 0;
    // } else if (scrollTop > maxScrollTop) {
    //   // スクロール位置が下端よりも大きい場合
    //   document.documentElement.scrollTop = maxScrollTop;
    // }

    const currentTouchY = e.touches[0].clientY;
    const touchDeltaY = previousTouchY - currentTouchY;
    previousTouchY = currentTouchY;
    speed += touchDeltaY * 0.0015;
  });
}

//アニメーション
raf();
function raf() {
  position += speed;
  speed *= 0.8;

  objs.forEach((o, i) => {
    o.dist = Math.min(Math.abs(position - i), 1);
    o.dist = 1.0 - o.dist ** 2; //0～1（アクティブな要素は1、非アクティブは0）
    elems[i].style.transform = `scale(${1 + 0.4 * o.dist})`;
    let scale = 1 + 0.1 * o.dist;
    sketch.meshes[i].position.y = -i * 1.2 + position * 1.2;
    sketch.meshes[i].scale.set(scale, scale, scale);
    sketch.meshes[i].material.uniforms.distanceFromCenter.value = o.dist;
  });

  rounded = Math.round(position);

  let diff = rounded - position;

  if (attractMode) {
    position += -(position - attractTo) * 0.01;
  } else {
    position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.015;
    wrap.style.transform = `translate(0,${-position * 100 + 50}px)`;
  }

  // console.log(position, elemsLength);

  //スクロール範囲を限定
  if (position > elemsLength - 1) {
    position = elemsLength - 1;
  } else if (position < 0) {
    position = 0;
  }

  window.requestAnimationFrame(raf);
}

const navs = [...document.querySelectorAll(".nav li")];
const nav = document.querySelector(".nav");

let rots = sketch.groups.map((e) => {
  return e.rotation;
});

nav.addEventListener("mouseenter", () => {
  attractMode = true;
  gsap.to(rots, {
    x: -0.5,
    y: 0,
    z: 0,
  });
});
nav.addEventListener("mouseleave", () => {
  attractMode = false;
  gsap.to(rots, {
    x: -0.3,
    y: -0.5,
    z: -0.1,
  });
});

navs.forEach((el) => {
  el.addEventListener("mouseover", () => {
    attractTo = Number(el.getAttribute("data-nav"));
  });
});

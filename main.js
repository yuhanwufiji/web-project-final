import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { GammaCorrectionShader } from "three/examples/jsm/shaders/GammaCorrectionShader.js";
import { gsap } from "gsap/gsap-core";
import { openPopup } from './popup.js';
import {
  PerspectiveCameraForResizableWindow,
  handleCameraRotation,
  handleMouseMovement,
} from "./CameraWithMouseRotation.js";
import CameraOrientationState from "./CameraOrientationState.js";
import { PI } from "three/examples/jsm/nodes/Nodes.js";
// main.js
// import { openPopup } from './popup.js';
// window.openPopup = openPopup;

// import { closePopup } from './popup.js';
// window.closePopup = closePopup;

let scene, camera, renderer, composer, model, controls, raycaster;
const objects = [];
let cameraOrientationState = new CameraOrientationState();
let lastCameraPosition = new THREE.Vector3();
const button = document.getElementById("fixedButton");
const backgroundVideo = document.getElementById("backgroundVideo");
const loadingDiv = document.getElementById("loading");
const startPage = document.getElementById("startingpage");
const videoOverlay = document.getElementById("videoOverlay");
const introVideo = document.getElementById("introVideo");
const threeContainer = document.getElementById("three-wrapper");
const shopButton = document.getElementById("shopButton");
const leaveButton = document.getElementById("leaveButton");

const buttons = [
  {
    element: document.getElementById("potButton2"),
    position: new THREE.Vector3(2, 0.7, 0),
  },
  {
    element: document.getElementById("potButton1"),
    position: new THREE.Vector3(-0.9, 0.9, 0),
  },
  {
    element: document.getElementById("posterButton"),
    position: new THREE.Vector3(-2, 1.3, 0),
  },
  {
    element: document.getElementById("leaveButton"),
    position: new THREE.Vector3(2.9, 1.8, 1),
  },
  {
    element: document.getElementById("shopButton"),
    position: new THREE.Vector3(0, 1.4, 0),
  },
];
const mouse = new THREE.Vector2();

shopButton.addEventListener("click", () => {
  openPopup('./overlay.html');  // 调用 openPopup 函数
});

potButton1.addEventListener("click", () => {
  openPopup('./Persimmons.html');  // 调用 openPopup 函数
});

potButton2.addEventListener("click", () => {
  openPopup('./hotpot.html');  // 调用 openPopup 函数
});

posterButton.addEventListener("click", () => {
  openPopup('./poster.html');  // 调用 openPopup 函数
});



window.addEventListener("load", () => {
  // Notify iframe to start loading
});

button.addEventListener("mouseover", () => {
  backgroundVideo.play();
});

button.addEventListener("mouseout", () => {
  // Do nothing, let the video play to the end
});

button.addEventListener("click", () => {
  startPage.style.display = "none";
  videoOverlay.style.display = "flex";
  introVideo.play();
  threeContainer.style.display = "flex";
});

leaveButton.addEventListener("click", () => {
  startPage.style.display = "flex";
  threeContainer.style.display = "none";
  // startPage.style.opacity = 100;
  // 使用 GSAP 让元素淡入显示
  gsap.to(startPage, { duration: 1, opacity: 1, ease: "power2.inOut" });
});

introVideo.addEventListener("ended", () => {
  videoOverlay.style.display = "none";
});

init();

function init() {
  // Scene
  scene = new THREE.Scene();

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true; // 启用阴影
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 使用柔和阴影
  renderer.toneMapping = THREE.ReinhardToneMapping; // 设置色调映射
  renderer.toneMappingExposure = 10; // 增加曝光
  //renderer.outputEncoding = THREE.sRGBEncoding;
  threeContainer.appendChild(renderer.domElement);
  const targetLookAt2 = new THREE.Vector3(-2.3, 1, -0.7);

  // Camera
  camera = PerspectiveCameraForResizableWindow(30, 0.1, 10000, renderer);
  camera.position.set(1, 1.2, 6);
  // camera.lookAt(new THREE.Vector3(0, -1, -1));

  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(1.04, 1.03, 4.53);

  camera.lookAt(targetLookAt2);
  lastCameraPosition.copy(camera.position);

  // Raycaster
  raycaster = new THREE.Raycaster();

  // Configure and load GLTF model with DRACOLoader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.4.1/"
  );

  const loader = new GLTFLoader();
  // loader.setDRACOLoader(dracoLoader);
  loader.load(
    "8.6.glb",
    function (gltf) {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          // console.log(child.name); // 输出模型名称到控制台
          child.castShadow = true;
          child.receiveShadow = true;
          objects.push(child); // Add mesh to objects array

          if (child.material) {
            child.material.roughness = 0.1;
            child.material.metalness = 0.1;
            child.material.emissiveIntensity = 0.5; // 根据需要调整
          }
        }
      });
      scene.add(model);
      scene.rotation.y = -Math.PI / 2;
      loadingDiv.style.display = "none";
      animate();
    },
    function (xhr) {
      const progress = (xhr.loaded / xhr.total) * 100;
      progressText.textContent = Math.round(progress) + "%";
      console.log(progress + "% loaded");
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  // Postprocessing
  composer = new EffectComposer(renderer);

  // Render pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // Unreal Bloom pass
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.2,
    0.4,
    0.85
  );
  bloomPass.threshold = 0;
  bloomPass.strength = 0.2;
  bloomPass.radius = 0;
  composer.addPass(bloomPass);

  // Gamma correction pass
  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaCorrectionPass);

  // FXAA pass
  const fxaaPass = new ShaderPass(FXAAShader);
  const pixelRatio = renderer.getPixelRatio();
  fxaaPass.material.uniforms["resolution"].value.x =
    1 / (window.innerWidth * pixelRatio);
  fxaaPass.material.uniforms["resolution"].value.y =
    1 / (window.innerHeight * pixelRatio);
  composer.addPass(fxaaPass);

  // Handle window resize
  window.addEventListener("resize", onWindowResize, false);

  // Mouse move event listener
  window.addEventListener("mousemove", onMouseMove, false);

  // Mouse click event listener
  // window.addEventListener("click", onMouseClick, false);

  // Move camera on button click
  const moveButton = document.getElementById("move-button");
  // moveButton.addEventListener("click", onMoveButtonClick);
}

function updateButtonPositions() {
  buttons.forEach((button) => {
    const vector = button.position.clone().project(camera);
    let buttonPosition = {
      x: (vector.x * 0.5 + 0.5) * window.innerWidth,
      y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
    };

    if (button.element.id === "leaveButton") {
      const customOffset = { x: 0, y: 0 }; // 自定义偏移值
      buttonPosition.x += customOffset.x;
      buttonPosition.y += customOffset.y;
    }

    if (button.element.id === "potButton2") {
      const customOffset = { x: 0, y: 0 }; // 自定义偏移值
      buttonPosition.x += customOffset.x;
      buttonPosition.y += customOffset.y;
    }

    button.element.style.left = `${buttonPosition.x}px`;
    button.element.style.top = `${buttonPosition.y}px`;
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  // Normalize mouse coordinates to [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = (event.clientY / window.innerHeight) * 2 - 1;

  handleMouseMovement(mouse.x, mouse.y, cameraOrientationState);
}
document.addEventListener("mousemove", onMouseMove, false);

function animate() {
  requestAnimationFrame(animate);
  handleCameraRotation(camera, cameraOrientationState);
  // Render scene with composer
  composer.render();
  updateButtonPositions();
}

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
import { gsap } from "gsap";
import { showInfoDiv } from "./showInfoDiv.js"; // 导入 showInfoDiv 函数

let scene, camera, renderer, composer, model, controls, raycaster, mouse;
const objects = [];
let lastCameraPosition = new THREE.Vector3();
const button = document.getElementById("fixedButton");
const backgroundVideo = document.getElementById("backgroundVideo");
const loadingDiv = document.getElementById("loading");
const startPage = document.getElementById("startingpage");
const videoOverlay = document.getElementById("videoOverlay");
const introVideo = document.getElementById("introVideo");

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
  // Send message to iframe to start loading nextpage
  // window.location.href = "nextpage.html";
});

button.addEventListener("click", () => {
  startPage.style.display = "none";
  videoOverlay.style.display = "flex";
  introVideo.play();
});

introVideo.addEventListener("ended", () => {
  videoOverlay.style.display = "none";
});

init();
animate();

function init() {
  const container = document.createElement("div");
  container.className = "three-container";
  document.body.appendChild(container);

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
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  // Camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(5.04, 1.03, -1.53);
  camera.rotation.set(0, 14.29, 0);
  lastCameraPosition.copy(camera.position);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Configure and load GLTF model with DRACOLoader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/'); // 设置 Draco 解码器路径

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "output.glb",
    function (gltf) {
      model = gltf.scene;
      model.traverse((child) => {
        if (child.isMesh) {
          console.log(child.name); // 输出模型名称到控制台
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
      loadingDiv.style.display = "none";
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
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
    0.2, 0.4, 0.85
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

  // Mouse click event listener
  window.addEventListener("click", onMouseClick, false);

  // Move camera on button click
  const moveButton = document.getElementById("move-button");
  // moveButton.addEventListener("click", onMoveButtonClick);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseClick(event) {
  // Normalize mouse coordinates to [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(objects);

  if (intersects.length > 0) {
    const intersectedObject = intersects[0].object;
    console.log(intersectedObject.name); // 输出被点击对象的名称
    // Check if the clicked object is the specific model
  }
  if (intersectedObject.name === "zhuozil") {
    // alert("clicked");
    showInfoDiv(camera);
  }
}

function onMoveButtonClick() {
  gsap.to(camera.position, {
    duration: 2,
    x: 10, // 设置新的x位置
    y: 5, // 设置新的y位置
    z: -5, // 设置新的z位置
    onUpdate: function() {
      camera.lookAt(scene.position);
    },
    onComplete: function() {
      lastCameraPosition.copy(camera.position);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (!camera.position.equals(lastCameraPosition)) {
    updateMaterials();
    lastCameraPosition.copy(camera.position);
  }

  // Render scene with composer
  composer.render();
}

function updateMaterials() {
  objects.forEach((child) => {
    if (child.material) {
      child.material.needsUpdate = true;
    }
  });
}

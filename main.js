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
const threeContainer = document.getElementById("three-container");
const shopButton = document.getElementById("shopButton");

const buttons = [
  { element: document.getElementById('shopButton'), position: new THREE.Vector3(1, 2, 0) },
  { element: document.getElementById('potButton'), position: new THREE.Vector3(1, 1, 0) },
  { element: document.getElementById('posterButton'), position: new THREE.Vector3(-1, -1, 0) }
];

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
  renderer.outputEncoding = THREE.sRGBEncoding;
  threeContainer.appendChild(renderer.domElement);
  const targetLookAt2 = new THREE.Vector3(-2.3, 1, -0.7);

  // Camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.set(5.04, 1.03, -1.53);
  

  camera.lookAt(targetLookAt2);
  lastCameraPosition.copy(camera.position);

  // Raycaster
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Configure and load GLTF model with DRACOLoader
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.1/');

  const loader = new GLTFLoader();
  // loader.setDRACOLoader(dracoLoader);
  loader.load(
    "7.10.glb",
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
      animate();
    },
    function (xhr) {
      const progress = (xhr.loaded / xhr.total) * 100;
      progressText.textContent = Math.round(progress) + '%';
      console.log(progress + '% loaded');
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

  // Mouse move event listener
  window.addEventListener("mousemove", onMouseMove, false);

  // Mouse click event listener
  window.addEventListener("click", onMouseClick, false);

  // Move camera on button click
  const moveButton = document.getElementById("move-button");
  // moveButton.addEventListener("click", onMoveButtonClick);
}


function updateButtonPositions() {
  buttons.forEach(button => {
    const vector = button.position.clone().project(camera);
    const buttonPosition = {
      x: (vector.x * 0.5 + 0.5) * window.innerWidth,
      y: (-vector.y * 0.5 + 0.5) * window.innerHeight
    };
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

// function onMouseClick(event) {
//   // Normalize mouse coordinates to [-1, 1]
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   // Update the picking ray with the camera and mouse position
//   raycaster.setFromCamera(mouse, camera);

//   // Calculate objects intersecting the picking ray
//   const intersects = raycaster.intersectObjects(objects);

//   if (intersects.length > 0) {
//     const intersectedObject = intersects[0].object;
//     console.log(intersectedObject); // 输出被点击对象的名称
//     // Check if the clicked object is the specific model
//     if (intersectedObject.name === 'zhuozil') {
//       // alert("clicked");
//       showInfoDiv(camera);
//     }
//   }
  
// }

function onMouseMove(event) {
  // Define a sensitivity factor
camera.rotation.order = "YXZ"; // this is not the default
  const sensitivity = 0.01; // 调整这个值以改变灵敏度

  // Normalize mouse coordinates to [-1, 1]
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Convert normalized coordinates to world coordinates
  const vector = new THREE.Vector3(mouse.x * sensitivity, mouse.y * sensitivity, 0.5); // 乘以灵敏度因子
  vector.unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const pos = camera.position.clone().add(dir.multiplyScalar(distance));

  // Limit pos within specific ranges
  const minX = -1, maxX = 1;
  const minY = -1, maxY = 1;
  const minZ = -2, maxZ = 2;
  
  pos.x = Math.max(minX, Math.min(maxX, pos.x));
  pos.y = Math.max(minY, Math.min(maxY, pos.y));
  pos.z = Math.max(minZ, Math.min(maxZ, pos.z));

  // Update camera lookAt
  camera.lookAt(pos);
}







// function onMouseMove( event ) {

//   var mouseX = 0;
// var mouseY = 0;
// var scale = 1;
//     mouseX = - ( event.clientX / renderer.domElement.clientWidth ) * 2 + 1;
//     mouseY = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

//     camera.rotation.x = mouseY / scale;
//     camera.rotation.y = mouseX / scale;

// }

function animate() {
  requestAnimationFrame(animate);
  if (!camera.position.equals(lastCameraPosition)) {
    updateMaterials();
    lastCameraPosition.copy(camera.position);
  }
  
  // Render scene with composer
  composer.render();
  updateButtonPositions();
}

function updateMaterials() {
  objects.forEach((child) => {
    if (child.material) {
      child.material.needsUpdate = true;
    }
  });
}

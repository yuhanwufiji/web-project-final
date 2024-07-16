import * as THREE from "three";
import { gsap } from "gsap";

export function showInfoDiv(camera) {
  // 调整摄像头的角度
  const duration = 500; // 调整动画持续时间（毫秒）
  const start = Date.now();
  const initialPosition = camera.position.clone();
  const targetPosition = new THREE.Vector3(0.04, 1.03, -1.53); 
  const targetLookAt1 = new THREE.Vector3(0, 1, 0); // 目标模型的位置
  const targetLookAt2 = new THREE.Vector3(-2.3, 1, -0.7); // 目标模型的位置

  const animateCamera = () => {
    const elapsed = Date.now() - start;
    const t = Math.min(elapsed / duration, 1);
    camera.position.lerpVectors(initialPosition, targetPosition, t);
    camera.lookAt(targetLookAt1); // 确保相机始终面向目标位置

    if (t < 1) {
      requestAnimationFrame(animateCamera);
    } else {
      // 摄像头到达指定位置后延迟显示弹窗
      setTimeout(() => {
        const infoDiv = document.getElementById("info-container");
        gsap.to(infoDiv, { duration: 0.5, opacity: 1, display: 'block' });

        // 添加全局点击事件监听器
        const handleClickOutside = (event) => {
          if (!infoDiv.contains(event.target)) {
            gsap.to(infoDiv, {
              duration: 0.5, opacity: 0, onComplete: () => {
                infoDiv.style.display = "none";
                // 回到初始位置
                animateCameraBack();
              }
            });
            document.removeEventListener('click', handleClickOutside);
          }
        };
        document.addEventListener('click', handleClickOutside);
      }, 250); // 延迟250毫秒
    }
  };
  animateCamera();

  const animateCameraBack = () => {
    const backStart = Date.now();
    const currentCameraPosition = camera.position.clone();
    const animateBack = () => {
      const elapsed = Date.now() - backStart;
      const t = Math.min(elapsed / duration, 1);
      camera.position.lerpVectors(currentCameraPosition, initialPosition, t);
      camera.lookAt(targetLookAt2); // 可以根据需要调整相机的lookAt

      if (t < 1) {
        requestAnimationFrame(animateBack);
      }
    };
    animateBack();
  };
}

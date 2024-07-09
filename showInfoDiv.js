import * as THREE from "three";
import { gsap } from "gsap";

export function showInfoDiv(camera) {
  // 调整摄像头的角度
  const duration = 500; // 调整动画持续时间（毫秒）
  const start = Date.now();
  const initialPosition = camera.position.clone();
  const targetPosition = new THREE.Vector3(0.04, 1.03, -1.53); 

  const initialRotation = camera.position.clone();
  const targetRotation = new THREE.Vector3(0.17, 15.51, 0.00); 
  
//   const initialRotation = camera.rotation.clone();
//   const targetRotation = new THREE.Euler(
//     THREE.MathUtils.degToRad(0.17),
//     THREE.MathUtils.degToRad(15.51),
//     THREE.MathUtils.degToRad(0.00)
//   ); // 目标旋转角度（弧度）
  
  const animateCamera = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      camera.position.lerpVectors(initialPosition, targetPosition, t);
      
      camera.rotation.set(
        initialRotation.x + (targetRotation.x - initialRotation.x) * t,
        initialRotation.y + (targetRotation.y - initialRotation.y) * t,
        initialRotation.z + (targetRotation.z - initialRotation.z) * t
      );

      camera.rotation.set(
        initialRotation.x + (targetRotation.x - initialRotation.x) * t,
        initialRotation.y + (targetRotation.y - initialRotation.y) * t,
        initialRotation.z + (targetRotation.z - initialRotation.z) * t
      );

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
                      gsap.to(infoDiv, { duration: 0.5, opacity: 0, onComplete: () => {
                          infoDiv.style.display = "none";
                      }});
                      document.removeEventListener('click', handleClickOutside);
                  }
              };
              document.addEventListener('click', handleClickOutside);
          }, 250); // 延迟500毫秒
      }
  };
  animateCamera();
}
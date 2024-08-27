import * as THREE from 'three'

//Creates a basic Three.js PerspectiveCamera that 
export const PerspectiveCameraForResizableWindow = (cameraFOV, howNearToRender, howFarToRender, renderer) => {
    
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 10000); 
   

    //Set the pixel Ratio to be the same as the devices
    renderer.setPixelRatio( window.devicePixelRatio);


    return camera;
}

export const handleMouseMovement = (mouseX, mouseY, cameraOrientationState) => {
    const now = performance.now();

    cameraOrientationState.lastMouseMoveTime = now;

    const rotationScale = 0.05;

    cameraOrientationState.pitchAngle = -(mouseY * rotationScale) * Math.PI;
    cameraOrientationState.yawAngle = -(mouseX * rotationScale) * Math.PI;

    // 限制 pitchAngle 的范围
    const maxPitchAngle = 0;  // 90 度
    const minPitchAngle = -Math.PI / 16; // -90 度

    cameraOrientationState.pitchAngle = Math.max(minPitchAngle, Math.min(maxPitchAngle, cameraOrientationState.pitchAngle));

    // 限制 yawAngle 的范围（如果需要）
    const maxYawAngle = 0;  // 180 度
    const minYawAngle = -Math.PI/4; // -180 度

    cameraOrientationState.yawAngle = Math.max(minYawAngle, Math.min(maxYawAngle, cameraOrientationState.yawAngle));

    cameraOrientationState.startingPitchAngleForCurrentCoordinates = cameraOrientationState.previousPitchAngle;
    cameraOrientationState.startingYawAngleForCurrentCoordinates = cameraOrientationState.previousYawAngle;
}


export const handleCameraRotation = (camera, cameraOrientationState) => {
    const now = performance.now()
  
    const timeElapsed = now - cameraOrientationState.lastMouseMoveTime

    if( timeElapsed < cameraOrientationState.movementDuration){

        const timeLeftPercentage = timeElapsed / cameraOrientationState.movementDuration;
        const minimumDegreeOfChange = 0.05;
        
        // Calculate the interpolation factor based on the time elapsed since the last mouse movement
        let interpolationFactor = Math.max(timeLeftPercentage, minimumDegreeOfChange); 

        // Linearly interpolate the pitch and yaw angles
        const interpolatedPitchAngle = (1 - interpolationFactor) * cameraOrientationState.startingPitchAngleForCurrentCoordinates + interpolationFactor * cameraOrientationState.pitchAngle; //The max value for t will be one, since the time elapsed is the amount of time since the last update. And t will never be more than 1. It goes from 0 to 1 sort of like 0% of elapsed time cycle to 100%
        const interpolatedYawAngle = (1 - interpolationFactor) * cameraOrientationState.startingYawAngleForCurrentCoordinates + interpolationFactor * cameraOrientationState.yawAngle;
        

        camera.rotation.x = interpolatedPitchAngle;
        camera.rotation.y = interpolatedYawAngle;

        // update the previous pitch and yaw angles
        cameraOrientationState.previousPitchAngle = interpolatedPitchAngle;
        cameraOrientationState.previousYawAngle = interpolatedYawAngle;
    }
}

let overlayIframe = null;
let closeButton = null;


export function openPopup(htmlFilePath) {
    // if (overlayIframe) {
    //     overlayIframe.style.display = 'block';
    //     overlayIframe.src = htmlFilePath; // Update the iframe source
    //     return;
    // }

    // Create iframe
    overlayIframe = document.createElement('iframe');
    overlayIframe.style.position = 'fixed';
    overlayIframe.style.top = '0';
    overlayIframe.style.left = '0';
    overlayIframe.style.width = '100%';
    overlayIframe.style.height = '100%';
    overlayIframe.style.border = 'none';
    overlayIframe.style.zIndex = '2000';
    overlayIframe.src = htmlFilePath;

    // Create close button
    closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerHTML = '';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '2001'; // Ensure it appears above the iframe
    closeButton.style.backgroundImage = "url('/cb.png')"
    closeButton.style.backgroundColor = 'transparent'; // 透明背景
closeButton.style.backgroundSize = 'cover'; // 覆盖整个按钮区域
closeButton.style.backgroundPosition = 'center'; // 图片居中
closeButton.style.backgroundRepeat = 'no-repeat'; // 不重复图片
closeButton.style.width = '77px'; // 根据图片大小调整
closeButton.style.height = '77px';
closeButton.style.border = 'none';
    
    closeButton.onclick = closePopup;

    document.body.appendChild(overlayIframe);
    document.body.appendChild(closeButton);

    overlayIframe.onload = function() {
        setupCommunication();
    };
}

function closePopup() {
    
    // startPage.style.opacity = 0.5;


    if (overlayIframe) {
        overlayIframe.style.display = 'none';
    }
    if (closeButton) {
        closeButton.style.display = 'none';
    }
}
let overlayIframe = null;

function openPopup() {
    if (overlayIframe) {
        overlayIframe.style.display = 'block';
        return;
    }

    overlayIframe = document.createElement('iframe');
    overlayIframe.style.position = 'fixed';
    overlayIframe.style.top = '0';
    overlayIframe.style.left = '0';
    overlayIframe.style.width = '100%';
    overlayIframe.style.height = '100%';
    overlayIframe.style.border = 'none';
    overlayIframe.style.zIndex = '2000';
    overlayIframe.src = 'overlay.html';

    document.body.appendChild(overlayIframe);

    overlayIframe.onload = function() {
        setupCommunication();
    };

    // 添加点击事件监听器
    document.addEventListener('click', handleClickOutside);
}

// function setupCommunication() {
//     window.addEventListener('message', function(event) {
//         if (event.data === 'closeOverlay') {
//             closePopup();
//         }
//     });
// }

function handleClickOutside(event) {
    // 检查点击是否在iframe外部
    if (overlayIframe && !overlayIframe.contains(event.target)) {
        closePopup();
    }
}

function closePopup() {
    if (overlayIframe) {
        overlayIframe.style.display = 'none';
        // 移除点击事件监听器
        document.removeEventListener('click', handleClickOutside);
    }
}

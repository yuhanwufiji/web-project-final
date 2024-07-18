// popup.js

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
}

function setupCommunication() {
    window.addEventListener('message', function(event) {
        if (event.data === 'closeOverlay') {
            closePopup();
        }
    });
}

function closePopup() {
    if (overlayIframe) {
        overlayIframe.style.display = 'none';
    }
}
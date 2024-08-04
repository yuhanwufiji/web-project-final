let overlayIframe = null;
let closeButton = null;

function openPopup(htmlFilePath) {
    if (overlayIframe) {
        overlayIframe.style.display = 'block';
        overlayIframe.src = htmlFilePath; // Update the iframe source
        return;
    }

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
    closeButton.innerHTML = 'Close';
    closeButton.style.position = 'fixed';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '2001'; // Ensure it appears above the iframe
    closeButton.onclick = closePopup;

    document.body.appendChild(overlayIframe);
    document.body.appendChild(closeButton);

    overlayIframe.onload = function() {
        setupCommunication();
    };
}

function closePopup() {
    if (overlayIframe) {
        overlayIframe.style.display = 'none';
    }
    if (closeButton) {
        closeButton.style.display = 'none';
    }
}

// popup.js

let overlayElement = null;

function openPopup() {
    if (overlayElement) {
        overlayElement.style.display = 'block';
        return;
    }

    fetch('overlay.html')
        .then(response => response.text())
        .then(data => {
            const temp = document.createElement('div');
            temp.innerHTML = data;

            overlayElement = temp.querySelector('#overlay');

            if (overlayElement) {
                document.body.appendChild(overlayElement);
                overlayElement.style.display = 'block';

                const closeBtn = overlayElement.querySelector('.close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', closePopup);
                }

                overlayElement.addEventListener('click', function(event) {
                    if (event.target === this) {
                        closePopup();
                    }
                });
            }
        })
        .catch(error => console.error('Error loading overlay:', error));
}

function closePopup() {
    if (overlayElement) {
        overlayElement.style.display = 'none';
    }
}

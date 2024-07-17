function openPopup() {
    fetch('overlay.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
            document.getElementById('overlay').style.display = 'block';
        });
}

function closePopup() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
        overlay.remove();
    }
}

document.addEventListener('click', function(event) {
    const overlay = document.getElementById('overlay');
    if (event.target === overlay) {
        closePopup();
    }
});
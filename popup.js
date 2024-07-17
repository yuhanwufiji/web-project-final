function openPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');

    fetch('overlay.html')
        .then(response => response.text())
        .then(data => {
            popup.innerHTML = data;
            overlay.style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
}

function closePopup() {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}

window.closePopup = closePopup;
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Close modal if clicked outside the modal content
window.onclick = function(event) {
    if (event.target.className === 'modal') {
        closeModal(event.target.id);
    }
}

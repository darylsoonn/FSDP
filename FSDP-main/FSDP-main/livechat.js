const socket = io('http://localhost:8080');

// Set a fixed username for Alice (Customer Support)
let username = sessionStorage.getItem("username") || "John Park(Customer)";
sessionStorage.setItem("username", username);

console.log('Using fixed username:', username);

let nameAcknowledged = false;

function sendNameToServer() {
    console.log('Sending fixed username:', username);
    socket.emit('set_name', username);
}

socket.on('request_name', () => {
    if (!sessionStorage.getItem('nameSent')) {
        sendNameToServer();
        sessionStorage.setItem('nameSent', 'true');
        console.log('Server requested name. Sending username:', username);
    }
});

socket.on('name_acknowledged', () => {
    nameAcknowledged = true;
    console.log('Server has acknowledged the name:', username);
});

// Listen for messages from customers in the chat room
socket.on("message", (data) => {
    const { from, text } = data;

    const messageList = document.querySelector(".message-list");
    const messageWrapper = document.createElement("div"); // Wrapper for message alignment
    const el = document.createElement("li");

    el.textContent = `${from}: ${text}`;

    if (from === username) {
        el.classList.add("agent-message"); // Staff message
        messageWrapper.classList.add("agent-wrapper"); // Moves to right
    } else {
        el.classList.add("customer-message"); // Customer message
        messageWrapper.classList.add("customer-wrapper"); // Stays on left
    }

    messageWrapper.appendChild(el);
    messageList.appendChild(messageWrapper);

    // Auto-scroll to latest message
    messageList.scrollTop = messageList.scrollHeight;
});

// Function to send message
function sendMessage() {
    const messageInput = document.querySelector(".message-input");
    const message = messageInput.value.trim();

    if (message) {
        socket.emit("message", { from: username, text: message });
        messageInput.value = ""; // Clear input field
    }
}

// Handle sending messages when the button is clicked
document.querySelector(".send-btn").addEventListener("click", sendMessage);

// Allow user to press Enter key to send message
document.querySelector(".message-input").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent newline in input field
        sendMessage();
    }
});

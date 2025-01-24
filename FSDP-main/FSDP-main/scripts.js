function openChatbot() {
    alert("Chatbot functionality coming soon!");
}

const scrollElements = document.querySelectorAll(".scroll-animate");

const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) - offset
    );
};

const displayScrollElement = (element) => {
    element.classList.add("visible");
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 150)) {
            displayScrollElement(el);
        }
    });
};

let lastScrollY = window.scrollY;
const header = document.querySelector('header.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    // Scrolling down
    header.style.transform = 'translateY(-100%)'; // Hide header
  } else {
    // Scrolling up
    header.style.transform = 'translateY(0)'; // Show header
  }
  lastScrollY = window.scrollY;
});

window.addEventListener("scroll", () => {
    handleScrollAnimation();
});
window.addEventListener("load", () => {
    handleScrollAnimation();
});

let lastScrollTop = 0;

window.addEventListener("scroll", () => {
    const header = document.querySelector("header.header");
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        header.style.top = "-100px"; 
    } else {
        header.style.top = "0"; 
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded");
    await fetchAndDisplayAnnouncements();
    await fetchAndDisplayFAQs();

    // Poll announcements every 10 seconds
    setInterval(fetchAndDisplayAnnouncements, 10000);
});

async function fetchAndDisplayAnnouncements() {
    const announcementSection = document.querySelector("#announcement-list");

    if (!announcementSection) {
        console.error("Announcement section not found in DOM");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/announcements");
        if (!response.ok) throw new Error("Failed to load announcements");

        const data = await response.json();

        if (Array.isArray(data.Announcements)) {
            displayAnnouncements(data.Announcements);
        } else {
            console.error("Announcements key not found in data", data);
        }
    } catch (error) {
        console.error("Error fetching announcements:", error);
    }
}

function displayAnnouncements(announcements) {
    const announcementSection = document.querySelector("#announcement-list");

    if (!announcementSection) {
        console.error("Announcement section not found in DOM");
        return;
    }

    announcementSection.innerHTML = ""; // Clear the existing list

    announcements.forEach((announcement) => {
        const announcementItem = document.createElement("div");
        announcementItem.className = "announcement-item";
        announcementItem.innerHTML = `
            <div class="announcement-details">
                <h3 class="announcement-title">${announcement.Title}</h3>
                <p class="announcement-description">${announcement.DescriptionDetails}</p>
                <small class="announcement-date">Created on: ${new Date(
                    announcement.CreationDate
                ).toLocaleDateString()}</small>
            </div>
        `;
        announcementSection.appendChild(announcementItem);
    });
}



async function fetchAndDisplayFAQs() {
    const faqSection = document.querySelector("#faq-list");

    if (!faqSection) {
        console.error("FAQ section not found in DOM");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/faqs");
        if (!response.ok) throw new Error("Failed to load FAQs");

        const data = await response.json();

        if (Array.isArray(data.FAQ)) {
            displayFAQs(data.FAQ);
        } else {
            console.error("FAQ data is not in an array format:", data);
        }
    } catch (error) {
        console.error("Error fetching FAQs:", error);
    }
}

function displayFAQs(faqs) {
    const faqList = document.querySelector("#faq-list");
    faqList.innerHTML = ""; // Clear any existing content

    faqs.forEach((faq) => {
        const faqItem = document.createElement("div");
        faqItem.className = "faq-item";
        faqItem.textContent = faq.QuestionTitle;

        faqItem.addEventListener("click", () => {
            openModal({
                Title: faq.QuestionTitle,
                DescriptionDetails: faq.QuestionAnswer,
            });
        });

        faqList.appendChild(faqItem);
    });
}

function openModal(item) {
    const modal = document.getElementById("announcement-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    modalTitle.textContent = item.Title || item.QuestionTitle || "No title available";
    modalDescription.textContent = item.DescriptionDetails || item.QuestionAnswer || "No description available";

    modal.style.display = "block";
}

document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("announcement-modal").style.display = "none";
});

window.addEventListener("click", (event) => {
    const modal = document.getElementById("announcement-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

const recordButton = document.getElementById("recordButton");

let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Toggle recording state
recordButton.addEventListener("click", async () => {
    if (!isRecording) {
        // Start recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);

        audioChunks = [];
        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
            const file = new File([audioBlob], `recording_${new Date().toISOString().replace(/[:.]/g, "-")}.wav`);

            // Send audio file to backend
            await sendAudioFile(file);
        };

        mediaRecorder.start();
        recordButton.textContent = "Stop Recording";
        recordButton.classList.add("recording");
        isRecording = true;
    } else {
        // Stop recording
        mediaRecorder.stop();
        recordButton.textContent = "Start Recording";
        recordButton.classList.remove("recording");
        isRecording = false;
    }
});

// Send audio file to Node.js backend
async function sendAudioFile(file) {
    const formData = new FormData();
    formData.append("audio", file);

    try {
        // Update the fetch URL to point to the Node.js backend
        const response = await fetch("http://localhost:3000/api/transcribe", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Failed to process the audio file.");
        }

        const data = await response.json();
        if (data.text) {
            console.log("Transcription:", data.text);
            alert(`Transcription: ${data.text}`);
        } else {
            console.error("Error in response:", data.error);
        }
    } catch (error) {
        console.error("Error sending audio file:", error);
    }
}

// Function to apply the saved theme
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Apply and save the new theme
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
}

// Load the saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);

    // Add event listener to the button
    document.getElementById("darkModeToggle").addEventListener("click", toggleTheme);
});
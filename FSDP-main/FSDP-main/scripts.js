function openChatbot() {
    alert("Chatbot functionality coming soon!");
}

const scrollElements = document.querySelectorAll(".scroll-animate");

const elementInView = (el, offset = 0) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) - offset);
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
});

async function fetchAndDisplayAnnouncements() {
    const announcementSection = document.querySelector(".announcements");

    if (!announcementSection) {
        console.error("Announcement section not found in DOM");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/announcements");
        if (!response.ok) throw new Error("Failed to load announcements");

        const data = await response.json();
        console.log("Fetched announcement data:", data);

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
    const announcementSection = document.querySelector(".announcements");
    announcementSection.innerHTML = ""; 

    announcements.forEach(announcement => {
        const announcementItem = document.createElement("p");
        announcementItem.textContent = announcement.Title || "No title available";

        announcementItem.addEventListener('click', () => {
            openModal(announcement);
        });

        announcementSection.appendChild(announcementItem);
    });

    console.log("Announcements displayed successfully");
}

async function fetchAndDisplayFAQs() {
    const faqSection = document.querySelector(".faq");

    if (!faqSection) {
        console.error("FAQ section not found in DOM");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/faqs");
        if (!response.ok) throw new Error("Failed to load FAQs");

        const data = await response.json();
        console.log("Fetched FAQ data:", data);

        if (data.FAQ) {
            const faqItems = Array.isArray(data.FAQ) ? data.FAQ : Object.values(data.FAQ);
            displayFAQs(faqItems);
        } else {
            console.error("Unexpected FAQ data format:", data);
        }
    } catch (error) {
        console.error("Error fetching FAQs:", error);
    }
}

function displayFAQs(faqs) {
    const faqSection = document.querySelector(".faq");
    faqSection.innerHTML = ""; 

    faqs.forEach(faq => {
        const faqItem = document.createElement("p");
        faqItem.textContent = faq.QuestionTitle || "No title available";

        faqItem.addEventListener("click", () => {
            openModal(faq);
        });

        faqSection.appendChild(faqItem);
    });

    console.log("FAQs displayed successfully");
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

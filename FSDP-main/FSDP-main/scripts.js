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

let lastScrollTop = 0; // Keeps track of the last scroll position

window.addEventListener("scroll", () => {
    const header = document.querySelector("header.header");
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // If we scroll down, hide the header
    if (currentScroll > lastScrollTop) {
        header.style.top = "-100px"; // Hide header by moving it up
    } else {
        // If we scroll up, show the header
        header.style.top = "0"; // Reset position to show the header
    }

    // Update lastScrollTop to the current scroll position
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});

document.addEventListener("DOMContentLoaded", async () => {
    console.log("DOM fully loaded"); // Check if this runs
    const announcementSection = document.querySelector(".announcements");

    // Check if the announcement section exists in the DOM
    if (!announcementSection) {
        console.error("Announcement section not found in DOM"); // This message will help identify the issue
        return;
    }
    console.log("Announcement Section:", announcementSection); // Log the section to confirm it's found

    try {
        const response = await fetch("http://localhost:3000/api/announcements"); // Adjust API route if necessary
        if (!response.ok) throw new Error("Failed to load announcements");

        const data = await response.json();
        console.log("Fetched data:", data); // See what data is returned

        // Check if data contains announcements and call the display function
        if (data.Announcements) {
            displayAnnouncements(data.Announcements);
        } else {
            console.error("Announcements key not found in data", data);
        }

    } catch (error) {
        console.error("Error fetching announcements:", error);
    }
});

function displayAnnouncements(announcements) {
    const announcementSection = document.querySelector(".announcements");
    announcementSection.innerHTML = ""; // Clear existing announcements if needed

    announcements.forEach(announcement => {
        const announcementItem = document.createElement("p");
        
        // Title is displayed initially
        const title = announcement.Title || "No title available";
        announcementItem.textContent = title;

        // Add an event listener to open the modal when the title is clicked
        announcementItem.addEventListener('click', () => {
            openModal(announcement); // Pass the entire announcement object to the modal
        });

        announcementSection.appendChild(announcementItem);
    });

    console.log("Announcements displayed successfully");
}

function openModal(announcement) {
    // Set the modal content with the announcement details
    const modal = document.getElementById("announcement-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");

    modalTitle.textContent = announcement.Title || "No title available";
    modalDescription.textContent = announcement.DescriptionDetails || "No description available";

    // Show the modal
    modal.style.display = "block";
}

// Close the modal when the user clicks on <span> (x)
document.getElementById("close-modal").addEventListener("click", () => {
    const modal = document.getElementById("announcement-modal");
    modal.style.display = "none";
});

// Close the modal if the user clicks outside of the modal content
window.addEventListener("click", (event) => {
    const modal = document.getElementById("announcement-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});


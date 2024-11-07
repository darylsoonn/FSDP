function openChatbot() {
    alert("Chatbot functionality coming soon!");
}

const moreButton = document.getElementById('moreButton');
const hiddenItems = document.querySelectorAll('.carousel-item.hidden');

moreButton.addEventListener('click', () => {
    hiddenItems.forEach(item => {
        item.classList.remove('hidden'); // Show hidden items
    });
    moreButton.style.display = 'none'; // Hide the "More" button after clicking
});

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

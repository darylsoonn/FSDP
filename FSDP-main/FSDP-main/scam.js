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

function upvote(button) {
    let row = button.closest('tr'); // Find the closest row
    let voteCountElement = button.nextElementSibling; // Vote count span
    let voteCount = parseInt(voteCountElement.innerText);

    if (row.getAttribute('data-vote') === 'none') {
        voteCountElement.innerText = voteCount + 1;
        row.setAttribute('data-vote', 'upvoted'); // Set as upvoted
    } else if (row.getAttribute('data-vote') === 'downvoted') {
        voteCountElement.innerText = voteCount + 1;
        row.setAttribute('data-vote', 'none'); // Neutralize downvote
    }
}

function downvote(button) {
    let row = button.closest('tr'); // Find the closest row
    let voteCountElement = button.previousElementSibling; // Vote count span
    let voteCount = parseInt(voteCountElement.innerText);

    if (row.getAttribute('data-vote') === 'none') {
        voteCountElement.innerText = voteCount - 1;
        row.setAttribute('data-vote', 'downvoted'); // Set as downvoted
    } else if (row.getAttribute('data-vote') === 'upvoted') {
        voteCountElement.innerText = voteCount - 1;
        row.setAttribute('data-vote', 'none'); // Neutralize upvote
    }
}



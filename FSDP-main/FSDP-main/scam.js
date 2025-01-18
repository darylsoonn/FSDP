function openChatbot() {
    alert("Chatbot functionality coming soon!");
}

async function searchFunction() {
    const searchBar = document.getElementById("search-bar");
    const query = searchBar.value.trim();

    if (!query) {
        alert("Please enter a phone number to search.");
        return;
    }

    try {
        const response = await fetch(`/api/scamcall/search?phoneNumber=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (response.ok) {
            const tableBody = document.querySelector(".scam-table tbody");

            tableBody.innerHTML = ""; // Clear previous results

            data.recordset.forEach((call, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${call.PhoneNumber}</td>
                    <td>${call.ReportCount}</td>
                    <td>
                        <button class="vote-button upvote" onclick="upvote(this)">&#9650;</button>
                        <span class="vote-count">0</span>
                        <button class="vote-button downvote" onclick="downvote(this)">&#9660;</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            alert(data.message || "No record found for the entered phone number.");
        }
    } catch (err) {
        console.error(err);
        alert("An error occurred while searching for the phone number. Please try again.");
    }
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

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/scamcalls');
        const data = await response.json();

        if (response.ok) {
            console.log("Scam Calls Data:", data);  // Log the entire data to check its structure

            // Ensure that data.recordset is an array
            if (!Array.isArray(data.recordset)) {
                console.error("Expected an array of scam calls in 'recordset', but got:", data.recordset);
                alert("Unexpected data format. Please try again.");
                return;
            }

            const tableBody = document.querySelector(".scam-table tbody");

            if (!tableBody) {
                console.error("Table body not found");
                return; 
            }

            tableBody.innerHTML = '';  

            // Loop through the recordset array to display the scam calls
            data.recordset.forEach((call, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${call.PhoneNumber}</td>
                    <td>${call.ReportCount}</td> <!-- Updated to match the backend column name -->
                    <td>${call.totalUpvotes || 0}</td>
                    <td>
                        <button class="vote-button upvote" onclick="upvote(this)">&#9650;</button>
                        <span class="vote-count">${call.totalUpvotes || 0}</span>
                        <button class="vote-button downvote" onclick="downvote(this)">&#9660;</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.error("API Response Error:", data.message || "Unknown error");
            alert(data.message || "Failed to load scam calls.");
        }
    } catch (err) {
        console.error("Error loading scam calls:", err);
        alert("Error loading scam calls. Please try again.");
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/scamcalls');
        const data = await response.json();

        if (response.ok) {
            console.log("Scam Calls Data:", data);

            if (!Array.isArray(data)) {
                console.error("Expected an array of scam calls, but got:", data);
                alert("Unexpected data format. Please try again.");
                return;
            }

            const tableBody = document.querySelector(".scam-table tbody");

            if (!tableBody) {
                console.error("Table body not found");
                return;
            }

            tableBody.innerHTML = '';

            // Hardcoded upvotes data for each scam call
            const upvoteData = {
                '9305-2121': 5,
                '8200-2004': 7,
                '8775-2004': 4,
                '8443-1100': 3,
                '9004-6890': 6,
                '8934-5566': 2,
                '7265-3030': 1
            };

            // Track user votes to restrict multiple votes
            const userVotes = {};

            data.forEach((call, index) => {
                const upvotes = upvoteData[call.PhoneNumber] || 0;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${call.PhoneNumber}</td>
                    <td>${call.ReportCount}</td>
                    <td>
                        <button class="vote-button upvote" onclick="vote('upvote', '${call.PhoneNumber}', this)">&#9650;</button>
                        <span class="vote-count">${upvotes}</span>
                        <button class="vote-button downvote" onclick="vote('downvote', '${call.PhoneNumber}', this)">&#9660;</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Vote function to handle upvotes and downvotes
            window.vote = function(type, phoneNumber, button) {
                if (!userVotes[phoneNumber]) userVotes[phoneNumber] = { upvoted: false, downvoted: false };

                const voteCountElem = button.parentNode.querySelector(".vote-count");

                if (type === 'upvote' && !userVotes[phoneNumber].upvoted) {
                    userVotes[phoneNumber].upvoted = true;
                    voteCountElem.textContent = parseInt(voteCountElem.textContent) + 1;
                } else if (type === 'downvote' && !userVotes[phoneNumber].downvoted) {
                    userVotes[phoneNumber].downvoted = true;
                    voteCountElem.textContent = parseInt(voteCountElem.textContent) - 1;
                } else {
                    alert(`You have already ${type === 'upvote' ? 'upvoted' : 'downvoted'} this number.`);
                }
            };

        } else {
            console.error("API Response Error:", data.message || "Unknown error");
            alert(data.message || "Failed to load scam calls.");
        }
    } catch (err) {
        console.error("Error loading scam calls:", err);
        alert("Error loading scam calls. Please try again.");
    }
});

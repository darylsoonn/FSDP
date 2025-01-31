function openChatbot() {
    alert("Chatbot functionality coming soon!");
}

function viewHeatmap() {
    window.location.href = "/heatmap.html";
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

let currentStep = 1; // Track the current step
const totalSteps = 4; // Total number of steps

// Open the scam modal
function openScamModal() {
    document.getElementById("scam-modal").style.display = "block";
    updateNavigation(); // Initialize navigation buttons
}

// Close the scam modal
function closeScamModal() {
    document.getElementById("scam-modal").style.display = "none";
    resetForm();
}

// Go to the next step
function nextStep() {
    if (currentStep < totalSteps) {
        // Validate required fields before proceeding
        if (!validateCurrentStep()) return;

        document.getElementById(`step-${currentStep}`).style.display = "none";
        currentStep++;
        document.getElementById(`step-${currentStep}`).style.display = "block";
    }
    updateNavigation();
}

// Go to the previous step
function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step-${currentStep}`).style.display = "none";
        currentStep--;
        document.getElementById(`step-${currentStep}`).style.display = "block";
    }
    updateNavigation();
}

// Update navigation buttons and instructions
function updateNavigation() {
    const instructions = [
        "Step 1: Enter basic details",
        "Step 2: Enter scam description and upload proof",
        "Step 3: Enter scammer details and amount lost",
        "Step 4: Describe actions taken"
    ];
    document.getElementById("form-step-instruction").innerText = instructions[currentStep - 1];

    // Toggle visibility of buttons
    document.getElementById("prev-button").style.display = currentStep > 1 ? "inline-block" : "none";
    document.getElementById("next-button").style.display = currentStep < totalSteps ? "inline-block" : "none";
    document.getElementById("submit-button").style.display = currentStep === totalSteps ? "inline-block" : "none";
}

// Validate the form for the current step
function validateCurrentStep() {
    let isValid = true;
    const stepFields = document.querySelectorAll(`#step-${currentStep} input, #step-${currentStep} textarea`);
    stepFields.forEach((field) => {
        if (field.hasAttribute("required") && !field.value.trim()) {
            alert(`Please fill out the required field: ${field.previousElementSibling.innerText}`);
            isValid = false;
        }
    });
    return isValid;
}

// Validate the entire form upon submission
function validateForm() {
    const scamDetails = document.getElementById("description").value;
    if (scamDetails.split(' ').length > 200) {
        alert("Please limit your scam details to 200 words.");
        return false;
    }
    alert("Scam report submitted successfully!");
    return true;
}

// Reset the form and steps
function resetForm() {
    currentStep = 1;
    document.querySelectorAll(".form-step").forEach((step) => {
        step.style.display = "none";
    });
    document.getElementById("step-1").style.display = "block";
    updateNavigation();
    document.getElementById("report-scam-form").reset(); // Clear form fields
    document.getElementById("word-count").textContent = "0/200 words"; // Reset word count
}

function submitScamForm(event) {
    event.preventDefault();
    closeScamModal();
    document.getElementById("success-modal").style.display = "block";
}

function closeSuccessModal() {
    document.getElementById("success-modal").style.display = "none";
}

// Update word count for the scam description field
document.getElementById("description").addEventListener("input", function () {
    const wordCount = this.value.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById("word-count").textContent = `${wordCount}/200 words`;
});


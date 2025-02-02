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

// Close the scam modal and reset the form
function closeScamModal() {
  document.getElementById("scam-modal").style.display = "none";
  resetForm();
}

// Close the success modal (pop-up)
function closeSuccessModal() {
  document.getElementById("success-modal").style.display = "none";
}

// Navigation functions for multi-step form
function nextStep() {
    if (currentStep < totalSteps) {
      if (!validateCurrentStep()) return; // Validate required fields on current step
  
      // Hide and disable the current step
      const currentStepEl = document.getElementById(`step-${currentStep}`);
      currentStepEl.style.display = "none";
      currentStepEl.querySelectorAll("input, textarea, select").forEach(input => {
        input.disabled = true;
      });
  
      currentStep++;
      
      // Show and enable the next step
      const nextStepEl = document.getElementById(`step-${currentStep}`);
      nextStepEl.style.display = "block";
      nextStepEl.querySelectorAll("input, textarea, select").forEach(input => {
        input.disabled = false;
      });
    }
    updateNavigation();
  }
  

function prevStep() {
  if (currentStep > 1) {
    document.getElementById(`step-${currentStep}`).style.display = "none";
    currentStep--;
    document.getElementById(`step-${currentStep}`).style.display = "block";
  }
  updateNavigation();
}
  
function updateNavigation() {
    console.log("Current Step:", currentStep);
      
  const instructions = [
    "Step 1: Enter basic details",
    "Step 2: Enter scam description and upload proof",
    "Step 3: Enter scammer details and amount lost",
    "Step 4: Describe actions taken",
  ];
  document.getElementById("form-step-instruction").innerText =
    instructions[currentStep - 1];

  // Toggle visibility of navigation buttons
  document.getElementById("prev-button").style.display =
    currentStep > 1 ? "inline-block" : "none";
  document.getElementById("next-button").style.display =
    currentStep < totalSteps ? "inline-block" : "none";
  document.getElementById("submit-button").style.display =
    currentStep === totalSteps ? "inline-block" : "none";
}

// Validate required fields on the current step
function validateCurrentStep() {
  let isValid = true;
  const stepFields = document.querySelectorAll(
    `#step-${currentStep} input, #step-${currentStep} textarea`
  );
  stepFields.forEach((field) => {
    if (field.hasAttribute("required") && !field.value.trim()) {
      alert(`Please fill out the required field: ${field.previousElementSibling.innerText}`);
      isValid = false;
    }
  });
  return isValid;
}

// Reset the form and navigation
function resetForm() {
  currentStep = 1;
  document.querySelectorAll(".form-step").forEach((step) => {
    step.style.display = "none";
  });
  document.getElementById("step-1").style.display = "block";
  updateNavigation();
  document.getElementById("report-scam-form").reset();
  if (document.getElementById("word-count")) {
    document.getElementById("word-count").textContent = "0/200 words";
  }
}

function submitScamForm(event) {
    event.preventDefault();
    console.log("submitScamForm triggered");

    // Check if success modal exists
    let successModal = document.getElementById("success-modal");
    if (!successModal) {
        console.error("Error: success-modal element is missing!");
        return;
    }

    // Gather input values
    const victimName = document.getElementById("victim-name").value;
    const victimContact = document.getElementById("victim-contact").value;
    const scamDetails = document.getElementById("description").value;
    const scammerContact = document.getElementById("scammer-contact").value;
    const scamAmount = document.getElementById("amount-lost").value;
    const actionsTaken = document.getElementById("actions-taken").value;

    // Build the summary HTML
    const reportSummary = `
        <p><strong>Your Name:</strong> ${victimName}</p>
        <p><strong>Your Contact:</strong> ${victimContact}</p>
        <p><strong>Scam Details:</strong> ${scamDetails}</p>
        <p><strong>Scammer Contact Info:</strong> ${scammerContact || "N/A"}</p>
        <p><strong>Amount Lost:</strong> ${scamAmount || "N/A"}</p>
        <p><strong>Actions Taken:</strong> ${actionsTaken || "N/A"}</p>
        <p style="font-weight:bold; color:green;">Report Successful!</p>
    `;

    // Insert summary into the success modal
    document.getElementById("scam-summary").innerHTML = reportSummary;

    // Close the scam report modal
    closeScamModal();
    console.log("Closing scam modal...");

    // Show the success modal
    successModal.style.display = "block";
    console.log("Success modal should now be visible.");
}

// Update word count for scam details (if needed)
document.getElementById("description").addEventListener("input", function () {
  const wordCount = this.value.trim().split(/\s+/).filter(Boolean).length;
  document.getElementById("word-count").textContent = `${wordCount}/200 words`;
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded");

    let successModal = document.getElementById("success-modal");
    console.log("Success Modal:", successModal); // Debugging

    if (!successModal) {
        console.error("Error: success-modal not found!");
    }
});

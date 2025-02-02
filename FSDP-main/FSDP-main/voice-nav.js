let recognition;
    let synth = window.speechSynthesis;

    function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        console.error("Speech recognition not supported in this browser.");
        return;
    }

    if (!recognition) {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;  // Set to false to avoid duplicate phrases
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = function () {
            console.log("Speech recognition started...");
        };

        recognition.onerror = function (event) {
            console.error("Speech recognition error:", event.error);
            if (event.error === "not-allowed") {
                alert("Microphone access blocked. Please enable it in browser settings.");
            }
        };

        recognition.onend = function () {
            console.log("Speech recognition stopped.");
            if (voiceEnabled) {
                recognition.start();  // Restart listening when voice mode is enabled
            }
        };

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript;
            console.log("User said:", transcript);

            // **Clear previous message before sending**
            setTimeout(() => {
                sendToChatbot(transcript);
            }, 100);  // Delay to avoid conflicts
        };
    }
}

let voiceEnabled = false;

document.getElementById("extraVoiceButton").addEventListener("click", function () {
    let button = this;

    if (!recognition) {
        initSpeechRecognition();
    }

    if (button.classList.contains("recording")) {
        // Stop recording if it's already on
        recognition.stop();
        button.classList.remove("recording");
    } else {
        // Start recording if it's off
        button.classList.add("recording");

        recognition.onresult = function (event) {
            let transcript = event.results[0][0].transcript;
            console.log("User said:", transcript);

            // **Only call navigateBasedOnSpeech when "Activate Voice Input" is used**
            navigateBasedOnSpeech(transcript);
        };

        recognition.start();
    }
});


function navigateBasedOnSpeech(transcript) {
    const pages = {
        "card": "cards.html",
        "scam": "scam.html",
        "general": "general.html",
        "banking": "banking.html",
        "heatmap": "heatmap.html",
        "contact": "contact.html",
        "insurance": "insurance.html",
        "investment": "investment.html",
        "home": "index.html"
    };

    console.log("Transcript received:", transcript);  // Log the transcript for debugging

    for (let keyword in pages) {
        console.log(`Checking if "${transcript}" includes "${keyword}"`); // Log the check
        if (transcript.toLowerCase().includes(keyword.toLowerCase())) {
            console.log("Redirecting to:", pages[keyword]); // Log the redirection action
            window.location.href = pages[keyword];
            return; // Stop checking once a match is found
        }
    }

    console.log("No matching page found for:", transcript); // Log if no match is found
}

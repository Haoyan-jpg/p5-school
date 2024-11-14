let interests = [];
let selectedInterests = [];
let score = 0;
let questionPrompt;
let timer;
let timeLeft = 120;

const apiKey = "my cute api key was here"; 

function preload() {
    console.log("Preloading JSON file...");
    loadJSON("interests.json", (data) => {
        interests = data.interests;
        console.log("Loaded interests:", interests);
    });
}

function setup() {
    createCanvas(500, 500);
    console.log("Setting up canvas...");
    displayInitialMessage();
}

function draw() {
    background(240);
    drawCharacter();
}

function drawCharacter() {
    fill(200, 100, 100);
    ellipse(width / 2, height / 2 + 50, 80, 80); // Head
    fill(0);
    ellipse(width / 2 - 15, height / 2 + 45, 10, 10); 
    ellipse(width / 2 + 15, height / 2 + 45, 10, 10); 
    arc(width / 2, height / 2 + 60, 30, 20, 0, PI); 
}

function selectRandomInterests() {
    selectedInterests = shuffle(interests).slice(0, 3);
    console.log("Selected interests:", selectedInterests);
}

function displayInitialMessage() {
    console.log("Displaying initial message...");
    const factDisplay = select("#factDisplay");
    factDisplay.html("Welcome! I'll show you 3 facts about me.");
    setTimeout(showInterests, 2000);
}

function showInterests() {
    selectRandomInterests(); // Select new random interests
    const factDisplay = select("#factDisplay");
    factDisplay.html("<strong>Facts about me:</strong><br>" + selectedInterests.join("<br>"));
    requestQuestion(); // Generate a new GPT question based on the new interests
}

async function requestQuestion() {
    console.log("Requesting question from OpenAI based on selected interests...");
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",  // Change to the desired model
                messages: [
                    { "role": "system", "content": "You are pretending to be me and will create a very short scenario. Make the question more specific and from a first-person perspective." },
                    { "role": "user", "content": `Based on these interests: ${selectedInterests.join(", ")}, create a short, close-ended question.` }
                ],
                max_tokens: 80,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            console.error(`OpenAI API Error: ${response.status} - ${response.statusText}`);
            const errorDetails = await response.json();
            console.error("Error details:", errorDetails);
            return;
        }

        const data = await response.json();
        questionPrompt = data.choices[0].message.content.trim();
        console.log("Received question prompt:", questionPrompt);
        showQuestion();
        startTimer();  // Start the timer in the background
    } catch (error) {
        console.error("Error fetching question from OpenAI:", error);
    }
}

async function submitResponse() {
    clearInterval(timer);
    const responseText = select("#responseInput").value();
    if (responseText === "") {
        console.warn("No response text entered. Prompting user for input.");
        return;
    }
    console.log("Submitting response:", responseText);

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4",  // Change to the desired model
                messages: [
                    { "role": "system", "content": "Provide a JSON response with 'score' (1-10) and 'response' as feedback. Say it from a first-person perspective." },
                    { "role": "user", "content": `Evaluate this response: "${responseText}" based on these interests: ${selectedInterests.join(", ")}.` }
                ],
                max_tokens: 80,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            console.error(`OpenAI API Error: ${response.status} - ${response.statusText}`);
            const errorDetails = await response.json();
            console.error("Error details:", errorDetails);
            return;
        }

        const data = await response.json();
        const feedbackText = data.choices[0].message.content.trim();

        const cleanFeedback = feedbackText.replace(/```json|```/g, ''); // Remove code block markers
        const feedbackJson = JSON.parse(cleanFeedback);

        displayFeedback(feedbackJson);
    } catch (error) {
        console.error("Error fetching feedback from OpenAI:", error);
    }
}

function showQuestion() {
    console.log("Displaying question to user...");
    const questionDisplay = select("#questionDisplay");
    questionDisplay.html("<strong>Scenario Question:</strong><br>" + questionPrompt);
}

function startTimer() {
    timeLeft = 120;
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft -= 1;
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);
}

function displayFeedback(feedbackJson) {
    console.log("Displaying feedback...");
    const feedback = select("#feedback");

    // Position the feedback directly over the character's face
    const faceX = width*2.3 ; // Adjust based on your canvas size
    const faceY = height / 2 - 100; // Adjust based on your canvas size

    feedback.position(faceX, faceY); // Position feedback over the character's face
    feedback.style("width", "150px"); // Adjust width to fit the feedback
    feedback.style("text-align", "center"); // Center-align text within the box
    feedback.style("padding", "10px"); // Add padding for better readability
    feedback.style("background-color", "#ffffff"); // Set a background color if needed
    feedback.style("border", "2px solid red"); // Border to make it stand out
    feedback.style("border-radius", "8px"); // Rounded corners for style

    feedback.html(`Feedback: ${feedbackJson.response}<br>Score for this round: ${feedbackJson.score}`);
    score += feedbackJson.score;
    select("#score").html(`Score: ${score}`);
    console.log("Updated score:", score);

    if (score >= 50) {
        endGame();
    } else {
        showNextQuestionButton();
    }
}

function showNextQuestionButton() {
    // Position the "Next Question" button next to the "Submit" button
    const nextButton = createButton("Next Question");
    nextButton.position(select("#responseInput").x + select("#responseInput").width, select("#responseInput").y*2);
    nextButton.mousePressed(() => {
        nextButton.remove();
        showInterests(); 
    });
}

function endGame() {
    console.log("Game ended. Final score:", score);
    const factDisplay = select("#factDisplay");
    factDisplay.html(`Congratulations! You reached 50 points! Final Score: ${score}`);
}

// DOM Elements
const sendButton = document.getElementById("send-button");
const messageBox = document.getElementById("messagebox");
const chatWindow = document.getElementById("chat-window");
const userType = document.getElementById("user-type");

// Function to add a message to the chat window
function addMessageToChat(user, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", user); // Add user type as a class ('sender' or 'receiver')
  messageDiv.innerText = message;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
}

// Function to send message to AI Gemini
function sendToGeminiAI(userMessage) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "contents": [
      {
        "parts": [
          {
            "text": userMessage // Send user message dynamically
          }
        ]
      }
    ]
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  return fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAsiwiUEHmNWanqtxaV3_6xppSZ8oPkECA",
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.candidates[0].content.parts[0].text) // Extract AI reply
    .catch((error) => {
      console.error(error);
      return "Error: AI could not respond."; // Default error message
    });
}

// Handle Send Button Click
sendButton.addEventListener("click", async () => {
  const message = messageBox.value.trim(); // Get input value
  const selectedUser = userType.value; // Get selected user type

  if (message === "") return; // Don't send empty messages

  // Add user message to chat window
  addMessageToChat(selectedUser, message);

  // Clear the input field
  messageBox.value = "";

  // If sender is the user, send message to AI
  if (selectedUser === "sender") {
    // Add a loading message for AI
    addMessageToChat("receiver", "AI is typing...");

    // Get AI response
    const aiResponse = await sendToGeminiAI(message);

    // Remove loading message and add AI response
    const loadingMessage = chatWindow.querySelector(".receiver:last-child");
    if (loadingMessage) loadingMessage.remove(); // Remove "AI is typing..."

    addMessageToChat("receiver", aiResponse);
  }
});
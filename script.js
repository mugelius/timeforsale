// script.js
const purchasedSeconds = {}; // Store purchased seconds locally (initial state)

// Fetch the purchased seconds from the server on page load
fetch("/purchases")
  .then((response) => response.json())
  .then((data) => {
    Object.assign(purchasedSeconds, data); // Populate the local store with server data
    updateClockDisplay();
  })
  .catch((err) => console.error("Error fetching purchased seconds:", err));

// Handle purchase of second
document.getElementById("buySecondButton").addEventListener("click", () => {
  const input = document.getElementById("secondInput").value.trim();
  const messageBox = document.getElementById("message");

  // Validate input
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  if (!timeRegex.test(input)) {
    messageBox.textContent = "Invalid time format! Use HH:MM:SS.";
    return;
  }

  // Check if the second is already purchased
  if (purchasedSeconds[input]) {
    messageBox.textContent = `This second is already purchased! Message: ${purchasedSeconds[input]}`;
    return;
  }

  // Prompt for message
  const userMessage = prompt("Enter your message for this second:");
  if (!userMessage) {
    messageBox.textContent = "Purchase canceled.";
    return;
  }

  // Send purchase request to the server
  fetch("http://localhost:3000/purchaseSecond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time: input, message: userMessage }),
  })
    .then((response) => response.json())
    .then((data) => {
      messageBox.textContent = data.message;
      purchasedSeconds[input] = userMessage; // Update the local store
      updateClockDisplay(); // Update the clock display
    })
    .catch((error) => {
      messageBox.textContent = error.message;
    });
});

// Function to update the clock display
function updateClockDisplay() {
  // Update the display with the list of purchased seconds
  const clockCanvas = document.getElementById("clockCanvas");
  const ctx = clockCanvas.getContext("2d");

  ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);

  // Draw clock face
  ctx.beginPath();
  ctx.arc(200, 200, 190, 0, 2 * Math.PI);
  ctx.stroke();

  // Draw clock numbers
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = 200 + Math.cos(angle - Math.PI / 2) * 160;
    const y = 200 + Math.sin(angle - Math.PI / 2) * 160;
    ctx.fillText(i, x, y);
  }

  // Draw purchased seconds
  Object.keys(purchasedSeconds).forEach((time) => {
    const [hour, minute, second] = time.split(":").map(Number);
    const angle = ((second / 60) * 2 * Math.PI) - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(200 + Math.cos(angle) * 150, 200 + Math.sin(angle) * 150, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
  });
}

// Initialize Clock
function initClock() {
  setInterval(drawClock, 1000); // Update clock every second
}

// Start the Clock
initClock();
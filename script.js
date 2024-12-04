// Canvas and Context for Clock
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");

// Store Purchased Seconds
const purchasedSeconds = {};

// Draw Clock
function drawClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  // Draw clock hands
  drawHand((hours + minutes / 60) * (Math.PI / 6), 100, 6); // Hour hand
  drawHand((minutes + seconds / 60) * (Math.PI / 30), 140, 4); // Minute hand
  drawHand(seconds * (Math.PI / 30), 170, 2, "#FF0000"); // Second hand
}

// Draw a Clock Hand
function drawHand(angle, length, width, color = "#000") {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.moveTo(200, 200);
  ctx.lineTo(
    200 + Math.cos(angle - Math.PI / 2) * length,
    200 + Math.sin(angle - Math.PI / 2) * length
  );
  ctx.stroke();
}

// Handle Purchase
document.getElementById("buySecondButton").addEventListener("click", () => {
  const input = document.getElementById("secondInput").value.trim();
  const messageBox = document.getElementById("message");

  // Validate Input
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

  // Save purchase
  purchasedSeconds[input] = userMessage;
  messageBox.textContent = `You successfully purchased ${input}!`;

  console.log(purchasedSeconds); // For debugging
});

// Initialize Clock
function initClock() {
  setInterval(drawClock, 1000); // Update clock every second
}

// Start the Clock
initClock();
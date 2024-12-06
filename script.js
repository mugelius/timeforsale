// Canvas and Context for Clock
const canvas = document.getElementById("clockCanvas");
const ctx = canvas.getContext("2d");

// Store Purchased Seconds
const purchasedSeconds = {};

// Fetch Purchased Seconds from Backend
function fetchPurchasedSeconds() {
  fetch("http://localhost:3000/purchasedSeconds")  // Make sure this URL is correct
    .then((response) => response.json())
    .then((data) => {
      Object.assign(purchasedSeconds, data); // Merge purchased seconds data into our state
      drawClock(); // Redraw clock with updated data
    })
    .catch((error) => {
      console.error("Error fetching purchased seconds:", error);
    });
}

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

  // Highlight purchased seconds
  Object.keys(purchasedSeconds).forEach((time) => {
    const [h, m, s] = time.split(":").map(Number);
    if (h === hours && m === minutes && s === seconds) {
      ctx.fillText(purchasedSeconds[time], 200, 200);
    }
  });
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

  // Send data to server (backend)
  fetch("http://localhost:3000/purchaseSecond", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ time: input, message: userMessage }),
  })
    .then((response) => response.text())
    .then((successMessage) => {
      messageBox.textContent = successMessage;
      purchasedSeconds[input] = userMessage; // Update local data
      drawClock(); // Redraw the clock
    })
    .catch((error) => {
      messageBox.textContent = "Failed to make the purchase. Please try again.";
      console.error("Error during purchase:", error);
    });
});

// Initialize Clock
function initClock() {
  setInterval(drawClock, 1000); // Update clock every second
  fetchPurchasedSeconds(); // Fetch purchased seconds on start
}

// Start the Clock
initClock();
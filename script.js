const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const radius = canvas.height / 2;
ctx.translate(radius, radius);

function drawClock() {
  ctx.clearRect(-radius, -radius, canvas.width, canvas.height);
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawNumbers(ctx, radius) {
  ctx.font = `${radius * 0.15}px Arial`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let num = 1; num <= 12; num++) {
    const angle = (num * Math.PI) / 6;
    const x = Math.cos(angle) * (radius * 0.85);
    const y = Math.sin(angle) * (radius * 0.85);
    ctx.fillText(num, x, y);
  }
}

function drawTime(ctx, radius) {
  const now = new Date();
  const hour = now.getHours() % 12;
  const minute = now.getMinutes();
  const second = now.getSeconds();

  // Hour hand
  const hourAngle = ((hour + minute / 60) * Math.PI) / 6;
  drawHand(ctx, hourAngle, radius * 0.5, radius * 0.07);

  // Minute hand
  const minuteAngle = ((minute + second / 60) * Math.PI) / 30;
  drawHand(ctx, minuteAngle, radius * 0.75, radius * 0.05);

  // Second hand
  const secondAngle = (second * Math.PI) / 30;
  drawHand(ctx, secondAngle, radius * 0.9, radius * 0.02);
}

function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}

setInterval(drawClock, 1000);

// Function to purchase a second
const purchaseSecond = async (time, message) => {
  try {
    const response = await fetch("http://localhost:3000/purchaseSecond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time, message }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(`Second purchased successfully: ${time}`);
      displayMessage(time, message);
    } else {
      alert(`Failed to purchase second: ${data.error}`);
    }
  } catch (err) {
    console.error("Error purchasing second:", err);
    alert("An error occurred while purchasing the second.");
  }
};

// Function to fetch purchased seconds and their messages
const fetchPurchasedSeconds = async () => {
  try {
    const response = await fetch("http://localhost:3000/purchasedSeconds");
    const data = await response.json();

    for (const [time, info] of Object.entries(data)) {
      displayMessage(time, info.message);
    }
  } catch (err) {
    console.error("Error fetching purchased seconds:", err);
  }
};

// Display a message for a purchased second
const displayMessage = (time, message) => {
  const messageArea = document.getElementById("messageArea");
  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.innerHTML = `<strong>${time}</strong>: ${message}`;
  messageArea.appendChild(messageDiv);
};

// Event listener for the "Buy Second" button
document.getElementById("buySecondButton").addEventListener("click", () => {
  const time = document.getElementById("secondInput").value;
  const message = document.getElementById("secondMessage").value;

  if (!time || !message) {
    alert("Please enter a valid time and message.");
    return;
  }

  purchaseSecond(time, message);
});

// Fetch purchased seconds and messages on page load
fetchPurchasedSeconds();
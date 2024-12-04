// Initialize clock parameters and canvas context
const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
const secondHand = { length: radius - 10, color: "#ff0000", width: 2 };
const minuteHand = { length: radius - 20, color: "#0000ff", width: 4 };
const hourHand = { length: radius - 40, color: "#00ff00", width: 6 };

// Function to draw the clock face
function drawClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(radius, radius); // Move origin to the center of the canvas

  // Draw the clock circle
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#333";
  ctx.stroke();

  // Draw clock numbers (1-12)
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) * Math.PI / 180; // Angles for numbers
    const x = (radius - 30) * Math.cos(angle);
    const y = (radius - 30) * Math.sin(angle);
    ctx.fillText(i + 1, x, y);
  }

  // Draw clock hands
  const now = new Date();
  const second = now.getSeconds();
  const minute = now.getMinutes();
  const hour = now.getHours();

  // Draw second hand
  drawHand(second * 6, secondHand);

  // Draw minute hand
  drawHand(minute * 6 + second / 10, minuteHand);

  // Draw hour hand
  drawHand((hour % 12) * 30 + minute / 2, hourHand);

  ctx.translate(-radius, -radius); // Reset origin
}

// Function to draw a hand
function drawHand(angle, hand) {
  ctx.save();
  ctx.rotate(angle * Math.PI / 180); // Rotate hand by given angle
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -hand.length);
  ctx.strokeStyle = hand.color;
  ctx.lineWidth = hand.width;
  ctx.stroke();
  ctx.restore();
}

// Update clock every second
setInterval(drawClock, 1000);

// Function to calculate the total seconds between two times and display the price
document.getElementById("buyButton").addEventListener("click", function () {
  const startTime = document.getElementById("startTime").value.split(":");
  const endTime = document.getElementById("endTime").value.split(":");

  const startHour = parseInt(startTime[0]);
  const startMinute = parseInt(startTime[1]);
  const endHour = parseInt(endTime[0]);
  const endMinute = parseInt(endTime[1]);

  // Calculate the difference in time
  const startInSeconds = startHour * 3600 + startMinute * 60;
  const endInSeconds = endHour * 3600 + endMinute * 60;

  let totalSeconds = endInSeconds - startInSeconds;
  if (totalSeconds < 0) {
    totalSeconds += 12 * 3600; // Wrap around to the next day
  }

  const totalCost = totalSeconds; // 1 second = $1 for simplicity

  document.getElementById("selectedTime").innerText = `Selected Time: ${startHour}:${startMinute} - ${endHour}:${endMinute}\nTotal seconds: ${totalSeconds} = $${totalCost}`;

  // Implement PayPal button here (based on totalCost)
});
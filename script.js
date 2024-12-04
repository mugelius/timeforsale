const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 200;
let selectedSecond = null;

// Draw the clock face, numbers, and divisions
function drawClockFace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw hour, minute, and second divisions (boxes)
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI * 2) / 60;
    const x1 = centerX + Math.cos(angle) * radius;
    const y1 = centerY + Math.sin(angle) * radius;
    const x2 = centerX + Math.cos(angle) * (radius - 15);
    const y2 = centerY + Math.sin(angle) * (radius - 15);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  // Draw the numbers 1-12 for hours
  for (let i = 1; i <= 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const x = centerX + Math.cos(angle) * (radius - 30);
    const y = centerY + Math.sin(angle) * (radius - 30);
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(i, x, y);
  }
}

// Draw the clock hands (hour, minute, second)
function drawClockHands() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Draw the second hand
  const secondAngle = (seconds * Math.PI * 2) / 60;
  ctx.strokeStyle = "#ff0000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(secondAngle) * (radius - 20), centerY + Math.sin(secondAngle) * (radius - 20));
  ctx.stroke();

  // Draw the minute hand
  const minuteAngle = (minutes * Math.PI * 2) / 60;
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(minuteAngle) * (radius - 40), centerY + Math.sin(minuteAngle) * (radius - 40));
  ctx.stroke();

  // Draw the hour hand
  const hourAngle = (hours * Math.PI * 2) / 12;
  ctx.strokeStyle = "#0000ff";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + Math.cos(hourAngle) * (radius - 60), centerY + Math.sin(hourAngle) * (radius - 60));
  ctx.stroke();
}

// Draw the second numbers (boxes) that users can select
function drawSecondMarkers() {
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI * 2) / 60;
    const x = centerX + Math.cos(angle) * (radius - 60);
    const y = centerY + Math.sin(angle) * (radius - 60);
    const boxSize = 20;

    ctx.strokeStyle = "#000";
    ctx.strokeRect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize);

    // Add click event to handle second selection
    canvas.addEventListener('click', function(event) {
      const dist = Math.sqrt(Math.pow(event.offsetX - x, 2) + Math.pow(event.offsetY - y, 2));
      if (dist < boxSize) {
        selectedSecond = i + 1;
        alert("You selected second " + selectedSecond);
      }
    });
  }
}

// Start drawing the clock
function startClock() {
  setInterval(function() {
    drawClockFace();
    drawClockHands();
    drawSecondMarkers();
  }, 1000);
}

// Initialize clock and start the process
startClock();
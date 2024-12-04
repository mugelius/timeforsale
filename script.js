const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");

const clockRadius = canvas.width / 2;
const secondRadius = clockRadius - 10;
const secondSize = 30;  // Size of the box around each second
let messages = []; // Store messages for each second

// Function to draw the clock face and the second markers
function drawClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.translate(clockRadius, clockRadius); // Move the origin to the center

  // Draw clock circle
  ctx.beginPath();
  ctx.arc(0, 0, clockRadius - 5, 0, Math.PI * 2);
  ctx.stroke();

  // Draw second markers (boxes)
  drawSecondMarkers();

  // Draw hands
  drawHands();
}

// Function to draw the second markers as little boxes
function drawSecondMarkers() {
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI * 2) / 60;
    const x = secondRadius * Math.cos(angle);
    const y = secondRadius * Math.sin(angle);

    // Draw a box around each second
    ctx.beginPath();
    ctx.rect(x - secondSize / 2, y - secondSize / 2, secondSize, secondSize);
    ctx.stroke();

    // Display message if there's any message for this second
    if (messages[i]) {
      ctx.fillStyle = "#ff0000";
      ctx.fillText(messages[i], x, y);
    }
  }
}

// Function to draw the clock hands in sync with the real-time
function drawHands() {
  const now = new Date();
  const seconds = now.getSeconds();
  const secondsAngle = (seconds * Math.PI * 2) / 60;

  // Draw the second hand
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(secondRadius * Math.cos(secondsAngle), secondRadius * Math.sin(secondsAngle));
  ctx.stroke();
}

// Update the clock every second
setInterval(() => {
  drawClock();
}, 1000);

// Handle buying a second
document.getElementById("buyButton").addEventListener("click", () => {
  const second = parseInt(document.getElementById("second").value) - 1;
  const message = document.getElementById("message").value;

  // If second is between 0 and 59
  if (second >= 0 && second < 60) {
    messages[second] = message;

    // Display confirmation
    document.getElementById("messageArea").innerHTML = `Message added to second ${second + 1}`;
  }
});

// PayPal Button code (Use your actual client ID here)
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '1.00' // Each second is $1
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Transaction completed by ' + details.payer.name.given_name);
    });
  }
}).render('#paypal-button-container');

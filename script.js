// Global variables
const clockCanvas = document.getElementById("clock");
const ctx = clockCanvas.getContext("2d");
const buyButton = document.getElementById("buyButton");
const startTimeInput = document.getElementById("startTime");
const endTimeInput = document.getElementById("endTime");
const selectedTimeDiv = document.getElementById("selectedTime");
const messageArea = document.getElementById("messageArea");

// Set clock radius
const radius = clockCanvas.width / 2;

// Function to draw the clock hands, numbers, and divisions
function drawClock() {
  // Clear the canvas
  ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
  
  // Draw the clock circle
  ctx.beginPath();
  ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 10;
  ctx.stroke();

  // Draw numbers on the clock (1-12)
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30) * Math.PI / 180;
    const x = radius + Math.cos(angle) * (radius - 30);
    const y = radius + Math.sin(angle) * (radius - 30);
    ctx.fillText(i, x, y);
  }

  // Draw time divisions (seconds, minutes, hours)
  drawTimeDivisions();

  // Get current time
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  // Calculate angles for clock hands
  const hourAngle = ((hours % 12) + minutes / 60) * 30 * Math.PI / 180;
  const minuteAngle = (minutes + seconds / 60) * 6 * Math.PI / 180;
  const secondAngle = seconds * 6 * Math.PI / 180;

  // Draw clock hands
  drawClockHand(hourAngle, radius - 50, 6);
  drawClockHand(minuteAngle, radius - 30, 4);
  drawClockHand(secondAngle, radius - 10, 2);
}

// Function to draw a clock hand
function drawClockHand(angle, length, width) {
  ctx.beginPath();
  ctx.moveTo(radius, radius);
  ctx.lineTo(
    radius + Math.cos(angle) * length,
    radius + Math.sin(angle) * length
  );
  ctx.lineWidth = width;
  ctx.strokeStyle = "#000";
  ctx.stroke();
}

// Function to draw time divisions (boxes)
function drawTimeDivisions() {
  const totalSecondsIn12Hours = 43200; // 12 hours * 60 minutes * 60 seconds
  
  for (let i = 0; i < totalSecondsIn12Hours; i++) {
    const angle = (i * 360) / totalSecondsIn12Hours * Math.PI / 180;
    const x = radius + Math.cos(angle) * (radius - 50);
    const y = radius + Math.sin(angle) * (radius - 50);
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#ccc";
    ctx.fill();
  }
}

// Function to display the time range selected by the user
function displaySelectedTime() {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (startTime && endTime) {
    selectedTimeDiv.innerHTML = `You have selected from ${startTime} to ${endTime}.`;
  } else {
    selectedTimeDiv.innerHTML = "Please select a valid time range.";
  }
}

// Event listener to trigger the buy button action
buyButton.addEventListener("click", function () {
  const startTime = startTimeInput.value;
  const endTime = endTimeInput.value;

  if (startTime && endTime) {
    alert(`You have bought from ${startTime} to ${endTime}. Total: $${calculatePrice(startTime, endTime)}`);
    displaySelectedTime();
  } else {
    alert("Please select both a start and end time.");
  }
});

// Function to calculate the price based on the time range selected
function calculatePrice(startTime, endTime) {
  const start = convertTimeToSeconds(startTime);
  const end = convertTimeToSeconds(endTime);
  const totalSeconds = end - start;
  
  if (totalSeconds < 0) {
    alert("End time must be later than start time.");
    return 0;
  }
  
  return totalSeconds; // Each second is worth $1
}

// Function to convert HH:MM to seconds
function convertTimeToSeconds(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
}

// Function to initialize PayPal button
function initializePayPalButton() {
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: calculatePrice(startTimeInput.value, endTimeInput.value).toString()
          }
        }]
      });
    },
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        alert("Payment successful! Your time purchase has been processed.");
      });
    }
  }).render('#paypal-button-container');
}

// Initializing the clock and PayPal button
window.onload = function() {
  drawClock(); // Draw clock initially
  initializePayPalButton(); // Set up PayPal button

  // Update the clock every second
  setInterval(drawClock, 1000); 
};
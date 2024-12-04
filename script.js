let canvas = document.getElementById("clock");
let ctx = canvas.getContext("2d");
let radius = canvas.height / 2;
ctx.translate(radius, radius); // Move the origin to the center of the canvas

let clock = {
  // Drawing the clock
  drawClock: function() {
    ctx.clearRect(-radius, -radius, canvas.width, canvas.height); // Clear previous drawing

    ctx.beginPath();
    ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 5;
    ctx.stroke();

    this.drawDivisions();
    this.drawHands();
  },

  // Draw the divisions (seconds, minutes, hours)
  drawDivisions: function() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";

    // Draw 720 divisions for seconds
    for (let i = 0; i < 720; i++) {
      let angle = (2 * Math.PI / 720) * i;
      let xStart = (radius - 10) * Math.cos(angle);
      let yStart = (radius - 10) * Math.sin(angle);
      let xEnd = radius * Math.cos(angle);
      let yEnd = radius * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(xStart, yStart);
      ctx.lineTo(xEnd, yEnd);
      ctx.stroke();
    }
  },

  // Draw the clock hands
  drawHands: function() {
    let now = new Date();
    let sec = now.getSeconds();
    let min = now.getMinutes();
    let hr = now.getHours();

    // Calculate angle for each hand
    let secAngle = (sec * Math.PI) / 30;
    let minAngle = (min * Math.PI) / 30 + (sec * Math.PI) / 1800;
    let hrAngle = (hr % 12) * Math.PI / 6 + (min * Math.PI) / 360;

    this.drawHand(secAngle, radius - 10, 2, "red"); // Seconds hand
    this.drawHand(minAngle, radius - 30, 4, "green"); // Minutes hand
    this.drawHand(hrAngle, radius - 50, 6, "blue"); // Hours hand
  },

  // Draw a hand (hour, minute, second)
  drawHand: function(angle, length, width, color) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length * Math.cos(angle), length * Math.sin(angle));
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.stroke();
  }
};

// Animation loop to spin the clock
function animateClock() {
  clock.drawClock();
  requestAnimationFrame(animateClock);
}

// Initialize the clock
animateClock();

// Function to handle buying a second
document.getElementById("buySecondButton").addEventListener("click", function() {
  let time = document.getElementById("timeInput").value;
  alert("You bought the second at: " + time + " for $1");

  // Handle PayPal payment integration here
});

// Function to handle buying a minute
document.getElementById("buyMinuteButton").addEventListener("click", function() {
  alert("You bought 1 minute (60 seconds) for $60");

  // Handle PayPal payment integration here
});
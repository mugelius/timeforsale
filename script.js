// Constants for the clock hands and their time intervals
const SECOND_HAND = document.querySelector('.second-hand');
const MINUTE_HAND = document.querySelector('.minute-hand');
const HOUR_HAND = document.querySelector('.hour-hand');
const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

// For creating the clock boxes
const totalBoxes = 720; // 720 boxes = 12 hours x 60 minutes x 60 seconds
let boxes = [];

canvas.width = 500;
canvas.height = 500;

// Draw Clock with numbers 1-12 at correct positions and lines for each second
function drawClock() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Draw the clock face
  ctx.beginPath();
  ctx.arc(0, 0, 230, 0, 2 * Math.PI); // Outer circle
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#333';
  ctx.stroke();
  
  // Draw numbers 1-12
  ctx.font = '24px Arial';
  ctx.fillStyle = '#333';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 1; i <= 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x = Math.cos(angle) * 190;
    const y = Math.sin(angle) * 190;
    ctx.fillText(i, x, y);
  }

  // Draw 720 boxes for seconds
  const totalSeconds = 60;
  const secondsPerBox = totalBoxes / totalSeconds;
  for (let i = 0; i < totalBoxes; i++) {
    const angle = (i / totalBoxes) * 2 * Math.PI;
    const x1 = Math.cos(angle) * 200;
    const y1 = Math.sin(angle) * 200;
    const x2 = Math.cos(angle) * 210;
    const y2 = Math.sin(angle) * 210;
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.stroke();
    
    // Add each box as an object for interactivity
    boxes.push({x1, y1, x2, y2, selected: false, index: i});
  }
  ctx.resetTransform();
}

// Function to draw the clock hands (second, minute, hour)
function drawHands() {
  const now = new Date();
  
  const second = now.getSeconds() + now.getMilliseconds() / 1000;
  const minute = now.getMinutes() + second / 60;
  const hour = now.getHours() + minute / 60;

  // Second hand: 360 degrees / 60 seconds = 6 degrees per second
  const secondAngle = (second / 60) * 2 * Math.PI;
  SECOND_HAND.style.transform = `rotate(${secondAngle}rad)`;
  
  // Minute hand: 360 degrees / 60 minutes = 6 degrees per minute
  const minuteAngle = (minute / 60) * 2 * Math.PI;
  MINUTE_HAND.style.transform = `rotate(${minuteAngle}rad)`;
  
  // Hour hand: 360 degrees / 12 hours = 30 degrees per hour
  const hourAngle = (hour / 12) * 2 * Math.PI;
  HOUR_HAND.style.transform = `rotate(${hourAngle}rad)`;
  
  // Redraw the clock face and boxes every second
  drawClock();
  requestAnimationFrame(drawHands);
}

// Start drawing the clock hands and the clock face
requestAnimationFrame(drawHands);

// Logic for buying a second or minute
function handleBuy() {
  const selectedBoxes = boxes.filter(box => box.selected);
  
  if (selectedBoxes.length > 0) {
    alert("You selected " + selectedBoxes.length + " seconds! Preparing for payment.");
    // Trigger PayPal payment logic for multiple seconds
  } else {
    const selectedSecond = document.getElementById('secondInput').value;
    alert("You selected second: " + selectedSecond + " to purchase.");
    // Trigger PayPal payment for the specific second input
  }
}

// Event listeners for the minute/second selection boxes
canvas.addEventListener('click', function(event) {
  const clickX = event.offsetX;
  const clickY = event.offsetY;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const dx = clickX - centerX;
  const dy = clickY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 180 && distance < 210) { // Click inside the boxes' range
    const angle = Math.atan2(dy, dx);
    const boxIndex = Math.floor((angle + Math.PI) / (2 * Math.PI) * totalBoxes);
    
    const clickedBox = boxes[boxIndex];
    clickedBox.selected = !clickedBox.selected;
    
    // Toggle the box color for feedback
    if (clickedBox.selected) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
    } else {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
    }
    
    ctx.fillRect(clickedBox.x1, clickedBox.y1, clickedBox.x2 - clickedBox.x1, clickedBox.y2 - clickedBox.y1);
  }
});

// Button logic to handle user purchasing
document.getElementById('buyButton').addEventListener('click', handleBuy);

// PayPal Button integration (requires you to set up a PayPal button with your ID)
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '1.00' // Change dynamically based on second or minute purchased
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
const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');
const clockRadius = canvas.width / 2;
const minuteBoxContainer = document.getElementById('minute-box-container');
const buySecondButton = document.getElementById('buySecondButton');
const timeInput = document.getElementById('time-input');
const secondPrice = document.getElementById('secondPrice');

// Initialize clock angles for the hands
let secondHandAngle = 0;
let minuteHandAngle = 0;
let hourHandAngle = 0;

const updateClock = () => {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();

  // Calculate angles for the clock hands based on time
  secondHandAngle = (seconds / 60) * 2 * Math.PI;
  minuteHandAngle = ((minutes + seconds / 60) / 60) * 2 * Math.PI;
  hourHandAngle = ((hours % 12 + minutes / 60) / 12) * 2 * Math.PI;

  drawClock();
  requestAnimationFrame(updateClock);
};

const drawClock = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.translate(clockRadius, clockRadius); // Set the origin at the center of the clock

  // Draw clock face (numbers 1-12)
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 2 * Math.PI;
    const x = Math.cos(angle) * (clockRadius - 30);
    const y = Math.sin(angle) * (clockRadius - 30);
    ctx.fillText(i, x, y);
  }

  // Draw hour, minute, second hands
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#333";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(hourHandAngle) * (clockRadius - 50), Math.sin(hourHandAngle) * (clockRadius - 50));
  ctx.stroke();

  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(minuteHandAngle) * (clockRadius - 30), Math.sin(minuteHandAngle) * (clockRadius - 30));
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#f00";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(secondHandAngle) * (clockRadius - 10), Math.sin(secondHandAngle) * (clockRadius - 10));
  ctx.stroke();

  ctx.resetTransform(); // Reset the canvas transformation
};

const createMinuteBoxes = () => {
  for (let i = 0; i < 720; i++) {
    const box = document.createElement('div');
    box.className = 'box';
    box.addEventListener('click', () => purchaseBox(i));
    minuteBoxContainer.appendChild(box);
  }
};

const purchaseBox = (index) => {
  alert(`You bought box ${index + 1} for $50!`);
};

const purchaseSecond = () => {
  const time = timeInput.value;
  if (time.match(/^([0-9]{1,2}):([0-5]?[0-9]):([0-5]?[0-9])$/)) {
    alert(`You bought the second at ${time} for $1!`);
  } else {
    alert('Invalid time format! Please enter time as HH:MM:SS.');
  }
};

// Event listener for second purchase
buySecondButton.addEventListener('click', purchaseSecond);

// Start clock update loop
updateClock();

// Create minute boxes on page load
createMinuteBoxes();
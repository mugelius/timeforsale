// PayPal button setup
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: function() {
            // Retrieve the total value based on selected boxes or seconds
            let totalAmount = calculateTotalAmount();
            return totalAmount.toString();
          }
        }
      }]
    });
  },
  onApprove: function(data, actions) {
    return actions.order.capture().then(function(details) {
      alert('Transaction completed by ' + details.payer.name.given_name);
      // Reset selections and clear messages after purchase
      resetSelections();
    });
  }
}).render('#paypal-button-container');

// Global variable to track selected time boxes and input
let selectedBoxes = [];
let selectedTime = "";

// Get current time for clock hands animation
function setClockHands() {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hourAngle = (hours % 12) * 30 + minutes * 0.5; // Each hour is 30 degrees, and minute affects hour hand
  const minuteAngle = minutes * 6; // Each minute is 6 degrees
  const secondAngle = seconds * 6; // Each second is 6 degrees

  // Set rotation for hands
  document.querySelector('.hour-hand').style.transform = `rotate(${hourAngle}deg)`;
  document.querySelector('.minute-hand').style.transform = `rotate(${minuteAngle}deg)`;
  document.querySelector('.second-hand').style.transform = `rotate(${secondAngle}deg)`;

  // Update clock every second
  setTimeout(setClockHands, 1000);
}

// Create the clickable boxes for minutes and seconds
function createTimeBoxes() {
  const boxContainer = document.querySelector('.boxes-container');

  // Loop through for 720 boxes (12 hours * 60 minutes * 60 seconds)
  for (let i = 0; i < 720; i++) {
    let box = document.createElement('div');
    box.classList.add('box', 'minute-box'); // Start with minute boxes
    box.setAttribute('data-index', i);
    box.addEventListener('click', () => selectBox(i)); // Add event listener for clicks

    boxContainer.appendChild(box);
  }
}

// Select a box when clicked
function selectBox(index) {
  if (selectedBoxes.includes(index)) {
    selectedBoxes = selectedBoxes.filter(boxIndex => boxIndex !== index);
    document.querySelector(`[data-index="${index}"]`).classList.remove('selected');
  } else {
    selectedBoxes.push(index);
    document.querySelector(`[data-index="${index}"]`).classList.add('selected');
  }
}

// Function to calculate the total amount to be paid based on selections
function calculateTotalAmount() {
  let totalAmount = 0;

  // Each selected minute costs 50 dollars
  totalAmount += selectedBoxes.length * 50;

  // Handle seconds selection (if any)
  if (selectedTime !== "") {
    totalAmount += 1; // Each second costs 1 dollar
  }

  return totalAmount;
}

// Function to handle input time for seconds purchase
function handleSecondPurchase() {
  const timeInput = document.getElementById('time-input').value;
  
  // Validate the format (e.g., "12:34:56")
  const timePattern = /^([0-9]{1,2}):([0-9]{2}):([0-9]{2})$/;
  if (timePattern.test(timeInput)) {
    selectedTime = timeInput;
    alert(`You selected the second at ${selectedTime}`);
  } else {
    alert("Invalid time format. Please enter in HH:MM:SS format.");
  }
}

// Reset selected boxes after a successful purchase
function resetSelections() {
  selectedBoxes = [];
  selectedTime = "";
  document.querySelectorAll('.box').forEach(box => box.classList.remove('selected'));
  document.getElementById('message').value = '';
  document.getElementById('time-input').value = '';
}

// Start the clock animation
setClockHands();

// Initialize the time boxes for selection
createTimeBoxes();

// Handle the second purchase logic when "Buy Second" button is clicked
document.getElementById('buySecondButton').addEventListener('click', handleSecondPurchase);
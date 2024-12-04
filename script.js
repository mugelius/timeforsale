// Clock Code
const canvas = document.getElementById('clock');
const ctx = canvas.getContext('2d');

function drawClock() {
  const now = new Date();
  const radius = canvas.height / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.translate(radius, radius);
  ctx.rotate(-Math.PI / 2);

  ctx.beginPath();
  ctx.arc(0, 0, radius - 10, 0, Math.PI * 2);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 10;
  ctx.stroke();
  ctx.closePath();

  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  drawHand((hour % 12) * 30 + (minute / 2), radius - 40, 8); // Hour hand
  drawHand(minute * 6, radius - 20, 6); // Minute hand
  drawHand(second * 6, radius - 10, 4); // Second hand

  ctx.translate(-radius, -radius);
  setTimeout(drawClock, 1000);
}

function drawHand(degrees, length, width) {
  const radian = (Math.PI / 180) * degrees;
  const x = Math.cos(radian) * length;
  const y = Math.sin(radian) * length;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(x, y);
  ctx.lineWidth = width;
  ctx.strokeStyle = '#333';
  ctx.stroke();
  ctx.closePath();
}

drawClock();

// PayPal Button Script
paypal.Buttons({
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: '1.00'
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
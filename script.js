{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Clock Setup\
const canvas = document.getElementById('clock');\
const ctx = canvas.getContext('2d');\
const radius = canvas.width / 2;\
\
ctx.translate(radius, radius); // Move origin to the center of the clock\
\
function drawClock() \{\
  ctx.clearRect(-radius, -radius, canvas.width, canvas.height); // Clear canvas\
\
  const now = new Date();\
  const seconds = now.getSeconds();\
  const minutes = now.getMinutes();\
  const hours = now.getHours();\
\
  // Draw the clock face\
  ctx.beginPath();\
  ctx.arc(0, 0, radius - 10, 0, 2 * Math.PI);\
  ctx.stroke();\
\
  // Draw the second hand\
  const secondAngle = (seconds * Math.PI) / 30;\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(Math.sin(secondAngle) * radius, -Math.cos(secondAngle) * radius);\
  ctx.strokeStyle = '#f00';\
  ctx.lineWidth = 2;\
  ctx.stroke();\
\
  // Draw the minute hand\
  const minuteAngle = (minutes * Math.PI) / 30;\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(Math.sin(minuteAngle) * (radius - 20), -Math.cos(minuteAngle) * (radius - 20));\
  ctx.strokeStyle = '#000';\
  ctx.lineWidth = 4;\
  ctx.stroke();\
\
  // Draw the hour hand\
  const hourAngle = (hours % 12 + minutes / 60) * Math.PI / 6;\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(Math.sin(hourAngle) * (radius - 50), -Math.cos(hourAngle) * (radius - 50));\
  ctx.strokeStyle = '#000';\
  ctx.lineWidth = 6;\
  ctx.stroke();\
\
  requestAnimationFrame(drawClock);\
\}\
\
drawClock();\
\
// Buy button functionality\
document.getElementById('buyButton').addEventListener('click', function() \{\
  const seconds = document.getElementById('seconds').value;\
  const message = document.getElementById('message').value;\
  const image = document.getElementById('image').files[0];\
\
  let messageContent = `<p>Second bought: $\{seconds\} sec</p>`;\
  if (message) messageContent += `<p>$\{message\}</p>`;\
  if (image) messageContent += `<img src="$\{URL.createObjectURL(image)\}" alt="image">`;\
\
  const messageBox = document.createElement('div');\
  messageBox.classList.add('message-box');\
  messageBox.innerHTML = messageContent;\
\
  document.getElementById('messageArea').appendChild(messageBox);\
\});\
\
// PayPal Button integration\
paypal.Buttons(\{\
  createOrder: function(data, actions) \{\
    return actions.order.create(\{\
      purchase_units: [\{\
        amount: \{\
          value: '1.00' // Price per second\
        \}\
      \}]\
    \});\
  \},\
  onApprove: function(data, actions) \{\
    return actions.order.capture().then(function(details) \{\
      alert('Transaction completed by ' + details.payer.name.given_name);\
    \});\
  \}\
\}).render('#paypal-button-container');}
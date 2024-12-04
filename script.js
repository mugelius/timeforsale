{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww29200\viewh18380\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // JavaScript for clock animation and PayPal button\
let canvas = document.getElementById('clock');\
let ctx = canvas.getContext('2d');\
\
// Draw the clock every second\
function drawClock() \{\
  let now = new Date();\
  let hours = now.getHours();\
  let minutes = now.getMinutes();\
  let seconds = now.getSeconds();\
  \
  // Clear canvas\
  ctx.clearRect(0, 0, canvas.width, canvas.height);\
  \
  // Draw clock circle\
  ctx.beginPath();\
  ctx.arc(250, 250, 200, 0, Math.PI * 2);\
  ctx.strokeStyle = '#000';\
  ctx.lineWidth = 5;\
  ctx.stroke();\
  \
  // Draw hands\
  let hourAngle = (hours % 12 + minutes / 60) * 30;\
  let minuteAngle = (minutes + seconds / 60) * 6;\
  let secondAngle = seconds * 6;\
\
  ctx.lineWidth = 8;\
  ctx.beginPath();\
  ctx.moveTo(250, 250);\
  ctx.lineTo(250 + 100 * Math.cos(Math.PI / 2 - Math.PI * hourAngle / 180), 250 - 100 * Math.sin(Math.PI / 2 - Math.PI * hourAngle / 180));\
  ctx.stroke();\
\
  ctx.lineWidth = 5;\
  ctx.beginPath();\
  ctx.moveTo(250, 250);\
  ctx.lineTo(250 + 150 * Math.cos(Math.PI / 2 - Math.PI * minuteAngle / 180), 250 - 150 * Math.sin(Math.PI / 2 - Math.PI * minuteAngle / 180));\
  ctx.stroke();\
\
  ctx.lineWidth = 2;\
  ctx.beginPath();\
  ctx.moveTo(250, 250);\
  ctx.lineTo(250 + 180 * Math.cos(Math.PI / 2 - Math.PI * secondAngle / 180), 250 - 180 * Math.sin(Math.PI / 2 - Math.PI * secondAngle / 180));\
  ctx.stroke();\
\}\
\
setInterval(drawClock, 1000);\
\
// PayPal Button Integration\
paypal.Buttons(\{\
  createOrder: function(data, actions) \{\
    return actions.order.create(\{\
      purchase_units: [\{\
        amount: \{\
          value: '1.00' // Price for each second (1 dollar per second)\
        \}\
      \}]\
    \});\
  \},\
  onApprove: function(data, actions) \{\
    return actions.order.capture().then(function(details) \{\
      alert('Transaction completed by ' + details.payer.name.given_name);\
    \});\
  \}\
\}).render('#paypal-button-container');\
}
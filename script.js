{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const clockCanvas = document.getElementById('clock');\
const ctx = clockCanvas.getContext('2d');\
const buyButton = document.getElementById('buyButton');\
const messageInput = document.getElementById('message');\
const imageInput = document.getElementById('image');\
const submitMessageButton = document.getElementById('submitMessage');\
const messageArea = document.getElementById('messageArea');\
\
// Draw clock\
function drawClock() \{\
  const now = new Date();\
  const seconds = now.getSeconds();\
  const minutes = now.getMinutes();\
  const hours = now.getHours();\
\
  // Clear canvas\
  ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);\
\
  // Draw clock face\
  ctx.beginPath();\
  ctx.arc(250, 250, 200, 0, 2 * Math.PI);\
  ctx.strokeStyle = '#333';\
  ctx.lineWidth = 10;\
  ctx.stroke();\
\
  // Draw second hand\
  const secondAngle = (seconds / 60) * 2 * Math.PI;\
  ctx.save();\
  ctx.translate(250, 250);\
  ctx.rotate(secondAngle);\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(0, -180);\
  ctx.strokeStyle = '#ff0000';\
  ctx.lineWidth = 2;\
  ctx.stroke();\
  ctx.restore();\
\
  // Draw minute hand\
  const minuteAngle = (minutes / 60) * 2 * Math.PI;\
  ctx.save();\
  ctx.translate(250, 250);\
  ctx.rotate(minuteAngle);\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(0, -150);\
  ctx.strokeStyle = '#000';\
  ctx.lineWidth = 4;\
  ctx.stroke();\
  ctx.restore();\
\
  // Draw hour hand\
  const hourAngle = ((hours % 12) / 12) * 2 * Math.PI;\
  ctx.save();\
  ctx.translate(250, 250);\
  ctx.rotate(hourAngle);\
  ctx.beginPath();\
  ctx.moveTo(0, 0);\
  ctx.lineTo(0, -100);\
  ctx.strokeStyle = '#000';\
  ctx.lineWidth = 6;\
  ctx.stroke();\
  ctx.restore();\
\}\
\
setInterval(drawClock, 1000);\
\
// Add message to clock\
submitMessageButton.addEventListener('click', () => \{\
  const message = messageInput.value;\
  const imageFile = imageInput.files[0];\
\
  if (message || imageFile) \{\
    const messageDiv = document.createElement('div');\
    messageDiv.classList.add('message');\
\
    if (message) \{\
      const textElement = document.createElement('p');\
      textElement.innerText = message;\
      messageDiv.appendChild(textElement);\
    \}\
\
    if (imageFile) \{\
      const imageElement = document.createElement('img');\
      const reader = new FileReader();\
      reader.onload = () => \{\
        imageElement.src = reader.result;\
        messageDiv.appendChild(imageElement);\
      \};\
      reader.readAsDataURL(imageFile);\
    \}\
\
    messageArea.appendChild(messageDiv);\
    messageInput.value = '';\
    imageInput.value = '';\
  \}\
\});\
\
// PayPal button setup (client ID)\
paypal.Buttons(\{\
  createOrder: function(data, actions) \{\
    return actions.order.create(\{\
      purchase_units: [\{\
        amount: \{\
          value: 1 // Set price per second here (change for bulk purchases)\
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
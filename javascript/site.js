
// Tree drawing
function drawBranches(startX, startY, trunkWidth, level) {
  canvas = document.getElementById('tree');
  context = canvas.getContext('2d');
  if(level < 9) {
    var changeX = 150 / (level + 1);
    var changeY = 300 / (level + 1.5);

    var topRightX = startX + Math.random() * changeX;
    var topRightY = startY - Math.random() * changeY;

    var topLeftX = startX - Math.random() * changeX;
    var topLeftY = startY - Math.random() * changeY;

    // draw right branch
    context.beginPath();
    context.moveTo(startX + trunkWidth / 4, startY);
    context.quadraticCurveTo(startX + trunkWidth / 5, startY - trunkWidth, topRightX, topRightY);
    context.lineWidth = trunkWidth;
    context.lineCap = 'round';
    context.stroke();

    // draw left branch
    context.beginPath();
    context.moveTo(startX - trunkWidth / 4, startY);
    context.quadraticCurveTo(startX - trunkWidth / 6, startY - trunkWidth, topLeftX, topLeftY);
    context.lineWidth = trunkWidth;
    context.lineCap = 'round';
    context.stroke();

    drawBranches(topRightX, topRightY, trunkWidth * 0.6, level + 0.75);
    drawBranches(topLeftX, topLeftY, trunkWidth * 0.6, level + 0.75);
  }
}
canvas = document.getElementById('tree');
context = canvas.getContext('2d');
drawBranches(canvas.width / 4, canvas.height, 30, 0.1);

// Lighting
var bodyElement = document.querySelector("#lightning");

var requestAnimationFrame = window.requestAnimationFrame ||
                            window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var delay = 0;

function changeColor() {
    delay++;

    if (delay > 100) {
        bodyElement.style.backgroundColor = '#999999';
    }

    if (delay > 101) {
      bodyElement.style.backgroundColor = 'transparent';
    }

    if (delay > 110) {
      bodyElement.style.backgroundColor = '#999999';
    }

    if (delay > 115) {
      bodyElement.style.backgroundColor = 'transparent';
    }

    if (delay > 1000) {
      delay = 0;
      bodyElement.style.backgroundColor = 'transparent';
    }

    requestAnimationFrame(changeColor);
}

changeColor();

/*\
 *
 *	Canvas Pen
 *	V 1.1.1
 *	Javascript page 1 of 1
 *	Coded by Isaac Chen
 *	11/28/16 - 11/28/16
 *
\*/

/* Variables */

var page = "Canvas Pen"; // Used by seeecret stuff
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var mouseX = 0;
var mouseY = 0;
var oldMouseX = 0;
var oldMouseY = 0;
var mouseDown = false;
var PI2 = Math.PI * 2;

/* Functions */

function clearCanvas() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function size() {
  return document.getElementById("size").value;
}
function download() {
  var img = canvas.toDataURL("image/png");
  document.write("<img src='" + img + "'/>");
}

/* Code */

clearCanvas();
canvas.style.cursor = "crosshair";
canvas.onmousemove = function(event) {
  oldMouseX = mouseX;
  oldMouseY = mouseY;
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  if(mouseDown) {
    ctx.fillStyle = document.getElementById("color").value;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size() / 2, PI2, 0);
    ctx.fill();
    if(size() > 0) {
      ctx.beginPath();
      ctx.moveTo(oldMouseX, oldMouseY);
      ctx.lineTo(mouseX, mouseY);
      ctx.lineWidth = size();
      ctx.strokeStyle = document.getElementById("color").value;
      ctx.stroke();
      ctx.fill();
    }
  }
}
document.onmousedown = function() {
  mouseDown = true;
}
document.onmouseup = function() {
  mouseDown = false;
}
var page = "Circle Generator"; // Used by seeecret stuff
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.fillStyle = "#FFFFFF";
ctx.fillRect(0, 0, 808, 808);
var maxR;
var minR;
function getInput() {
  maxR = parseInt(prompt("Enter outer radius") || 50);
  minR = parseInt(prompt("Enter inner radius") || 0);
  maxR = maxR > 100 ? 100 : maxR;
  if(minR > maxR) {
    alert("The inner radius can't be larger than the outer radius!");
    getInput();
  }
  else if(minR < 0) {
    alert("The inner radius can't be less than zero!");
    getInput();
  }
}
function draw() {
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, 808, 808);
  getInput();
  while(maxR >= minR) {
    var radius = maxR * 8;
    maxR--;
    var x = radius;
    var y = 0;
    var xx = Math.pow(radius, 2);
    var pixels = [];
    function distance(xCoord, yCoord) {
      return Math.abs(xx - (Math.pow(xCoord, 2) + Math.pow(yCoord, 2)));
    }
    function addPixels() {
      pixels.push([x, y]);
      pixels.push([x, -y]);
      pixels.push([-x, y]);
      pixels.push([-x, -y]);
      pixels.push([y, x]);
      pixels.push([y, -x]);
      pixels.push([-y, x]);
      pixels.push([-y, -x]);
    }
    while(x >= y) {
      addPixels();
      y += 8;
      if(distance(x-8, y) < distance(x, y)) {
        x -= 8;
      }
    }
    if(maxR % 2 == 0) {
      ctx.fillStyle = "#000000";
      ctx.strokeStyle = "#808080";
    }
    else {
      ctx.fillStyle = "#FF0000";
      ctx.strokeStyle = "#800000"
    }
    for(key in pixels) {
      ctx.fillRect(pixels[key][0] + 400, pixels[key][1] + 400, 8, 8);
      ctx.strokeRect(pixels[key][0] + 400, pixels[key][1] + 400, 8, 8);
    }
  }
}
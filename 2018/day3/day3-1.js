const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day3.input");
var data = buffer.toString().split('\r\n');

const parseLine = function(line) {
  var bits = line.split(' ');
  var pos = bits[2].split(',');
  var size = bits[3].split('x');
  return {
    claim : parseInt(bits[0]),
    x: parseInt(pos[0]),
    y: parseInt(pos[1]),
    xSize: parseInt(size[0]),
    ySize: parseInt(size[1])
  }
}

var fabric = {};
var squares = 0;

for (i in data) {
  var parsed = parseLine(data[i]);
  for (x = parsed.x; x < parsed.x + parsed.xSize; x++) {
    for (y = parsed.y; y < parsed.y + parsed.ySize; y++) {
      pos = x.toString() + '-' + y.toString();
      if (!fabric.hasOwnProperty(pos)) {
        fabric[pos] = 0;
      } else if (fabric[pos] == 1) {
        squares++;
      }

      fabric[pos]++;
    }
  }
}

console.log(squares);
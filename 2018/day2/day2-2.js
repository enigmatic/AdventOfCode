const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day2.input");
var data = buffer.toString().split('\r\n');

const distance = function(x, y, min) {
  var dist = 0;
  for (var i = 0; i < x.length; i++) {
    if (x[i] != y[i]) {
      dist++;
      if (dist > min) return dist;
    }
  }
  return dist;
}

const anwser = function(x, y) {
  result = '';
  for (var i = 0; i < x.length; i++) {
    if (x[i] == y[i]) {
      result+= x[i];
    }
  }
  return result;
}


var minDist = 100;
var minX, minY
for (var i=0; i < data.length; i++) {
  xStr = data[i];
  for (var j = 1 + i; j < data.length; j++) {
    yStr = data[j];
    dist = distance(xStr, yStr, minDist);
    if (dist < minDist) {
      minDist = dist;
      minX = xStr;
      minY = yStr;
      //console.log('New Min:' + minDist + ' for ' + minX + ':' + minY);
    }
  }
}

console.log(anwser(minX, minY))
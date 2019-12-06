console.log('starting');

const data = require('./day1.json');

var sum = 0;
var frequency = {'0':1};

var i = 0;
while(true) {
  sum += data[i]
  var stringSum = sum.toString();
  if (frequency.hasOwnProperty(stringSum)) {
    console.log('seen ' + stringSum);
    break;
  } else {
    frequency[stringSum] = 1;
  }
  i++;
  if (i >= data.length) {
    i = 0;
    console.log('loop!');
  }
}

console.log(sum);
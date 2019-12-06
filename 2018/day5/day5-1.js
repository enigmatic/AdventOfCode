const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day5.input");
var data = buffer.toString().split('\r\n');

var suit = data[0];
var shrinking = true;
while(shrinking) {
  var smallerSuit = ''

  shrinking = false;
  for (i = 1; i < suit.length; i++) {
    
    if (i == suit.length) {
      smallerSuit += suit[i];
      break;
    }

    if (suit[i-1].toUpperCase() == suit[i].toUpperCase()) {
      if (suit[i-1] == suit[i]) {
        smallerSuit += suit[i-1];
      } else {
        i++;
        shrinking = true;
      }
    } else {
      smallerSuit += suit[i-1];
    }

    
    if (i+1 == suit.length) {
      smallerSuit+= suit[i];
    }

  }
  suit = smallerSuit;
}

console.log(suit.length);
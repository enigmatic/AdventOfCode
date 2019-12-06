const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day2.input");
var data = buffer.toString().split('\r\n');

twoCount = 0;
threeCount = 0;

for (i in data) {
  boxID = data[i];
  var letterDict = {}
  for (r in boxID) {
    var letter = boxID[r];
    if (!letterDict.hasOwnProperty(letter)) {
      letterDict[letter] = 0;
    }
    letterDict[letter] += 1;
  }
  var twice = false;
  var thrice = false;
  for (letterID in letterDict) {
    if (!twice && letterDict[letterID] == 2) {
      twice = true;
      twoCount +=1;
    }
    if (!thrice && letterDict[letterID] == 3) {
      thrice = true;
      threeCount +=1;
    }
  }
}

console.log('Checksum = ' + twoCount + '*' + threeCount + '=' + (twoCount*threeCount));
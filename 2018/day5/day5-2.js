const fs = require('fs');
var path = process.cwd();
var buffer = fs.readFileSync(path + "\\day5.input");
var data = buffer.toString().split('\r\n');

var alphabet = 'abcdefghijklmnopqrstuvwxyz';
regStrings = []
for (pos in alphabet) {
  var letter = alphabet[pos];
  regStrings.push(letter + letter.toUpperCase());
  regStrings.push(letter.toUpperCase() + letter);
}

var trimReg = new RegExp(regStrings.join('|'),'g');

var shrinkSize = function(polymer) {
  
  var suit = polymer;
  var shrinking = true;
  while(shrinking) {
    var smallerSuit = suit.replace(trimReg,'');
    shrinking = suit != smallerSuit;

    suit = smallerSuit
  }
  return suit.length;
}

var minLen = 1000000;
for (pos in alphabet) {
  var letter = alphabet[pos];
  var reg = new RegExp('[' +letter + letter.toUpperCase() + ']','g');
  var testStr = data[0].replace(reg, '');
  var len = shrinkSize(testStr);
  if (len < minLen) {
    minLen = len;
  }

}


console.log('minimum:' + minLen);
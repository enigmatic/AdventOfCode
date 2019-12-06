console.time('day9');
const players = 452;
const lastMarble = 71250 * 100;
const debug = false;


class Marble {
  public prev:Marble;
  public next:Marble;
  public value = 0;
  constructor() {
    this.prev = this;
    this.next = this;
  }
}

let currentMarble:Marble = new Marble();
currentMarble.next = currentMarble;
currentMarble.prev = currentMarble;

const firstMarble:Marble = currentMarble;

const playerScores:number[] = Array(players).fill(0);
let currentPlayer = 0;


const printTurn = ()=>{
  let output = '[' + (currentPlayer + 1) + '] ';
  var printMarble:Marble = firstMarble;
  
  if (printMarble === currentMarble) {
    output += '(' + printMarble.value + ')';
  } else {
    output += ' ' + printMarble.value + ' ';
  }

  printMarble = printMarble.next;

  while(firstMarble !== printMarble) {
    if (printMarble === currentMarble) {
      output += '(' + printMarble.value + ')';
    } else {
      output += ' ' + printMarble.value + ' ';
    }
    printMarble = printMarble.next;
  }
  console.log(output);
}

if (debug) console.log('[-] (0)');

let nextMarble = 1;

while (nextMarble <= lastMarble) {
  if (nextMarble % 23 === 0) {
    playerScores[currentPlayer] += nextMarble;
    
    let  i = 0;
    while(i < 7) {
      currentMarble = currentMarble.prev;
      i++;
    }

    let removed = currentMarble;
    currentMarble.next.prev = currentMarble.prev;
    currentMarble.prev.next = currentMarble.next;

    playerScores[currentPlayer] += currentMarble.value;
    currentMarble = currentMarble.next;

  } else {
    currentMarble = currentMarble.next;

    let insertMarble:Marble = {
      next: currentMarble.next,
      prev: currentMarble,
      value: nextMarble
    }
    insertMarble.next.prev = insertMarble;
    insertMarble.prev.next = insertMarble;
    currentMarble = insertMarble;
  }
  
  if (debug) printTurn();
  nextMarble++;
  currentPlayer++;
  if (currentPlayer === players) currentPlayer = 0;
}

//console.log(playerScores);
console.log(playerScores.reduce((prev, value) => Math.max(prev, value)));
console.timeEnd('day9');
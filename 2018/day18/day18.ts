console.time('day18');
import readFile from '../lib/readFile';

let debug = false;
var data:string[] = readFile(__dirname + '\\input.txt');

function printState(state:string[]) {
  state.forEach(line=>console.log(line));
};

function getNeighborChars(state:string[], y:number, x:number):Array<string> {
  return [[y-1, x-1], [y-1, x], [y-1, x+1],
          [y  , x-1],           [y  , x+1],
          [y+1, x-1], [y+1, x], [y+1, x+1]]
          .map(c=>{
            if (c[0] >= 0 && c[0] < state.length && 
              c[1] >= 0 && c[1] < state[0].length)
              return state[c[0]][c[1]];
            return ''
          }).filter(v => v.length>0);
}

function nextState(state:string[]):string[] {
  return state.map<string>((line, y)=> {
    return line.split('').map((char, x) => {
      let newChar = char;
      switch (char) {
        case '.':
            if (getNeighborChars(state, y, x).reduce((acc, c)=>{
              if (c === '|')
                  return acc+1;
              return acc;
            }, 0) > 2) newChar = '|';
          break;
        case '|': 
          if (getNeighborChars(state, y, x).reduce((acc, c)=>{
            if (c === '#')
                return acc+1;
            return acc;
          }, 0) > 2) newChar = '#'
          break;
      
        case '#':
          let lumber = false;
          let tree = false;
          
          getNeighborChars(state, y, x).forEach(c=>{
            if (c === '|')
              tree = true;
            if (c === '#')
              lumber = true;
          });
          
          if (!lumber || !tree) newChar = '.'
          break;
        default:
          break;
      }
      return newChar;
    }).join('')
  });
}


//printState(data);
let nState = data;
let iter = 0;
while (iter < 10) {
  iter++;
  nState = nextState(nState);
  //console.clear();
  //console.log(iter);
  //printState(nState);
}
//console.log('');
//console.log('');
//printState(nState);

let woods = 0;
let lumber = 0;
nState.forEach(line=>line.split('').forEach(c=>{
  switch (c) {
    case '|':
      woods++;
      break;

    case '#':
      lumber++;
      break;

    default:
      break;
  }
}))
console.log('woods:', woods);
console.log('lumber:', lumber);
console.log('part1:', woods * lumber);

var loopPrerun = 750;
while (iter < loopPrerun) {
  iter++;
  nState = nextState(nState);
  //console.clear();
  //console.log(iter);
  //printState(nState);
}

let loopCheck = JSON.stringify(nState);
let cycleLength = 0;
do {
  iter++;
  nState = nextState(nState);
  cycleLength++;
} while (
  loopCheck !== JSON.stringify(nState)
)

let maxTime = 1000000000;
console.log('Cycle Length:', cycleLength);
//((maxTime - ) % passed)
let offset = (maxTime - loopPrerun) % cycleLength;
console.log('offset:', offset);
//iter += ((maxTime - iter) / cycleLength) * cycleLength;

//nState = loopCheck;
iter = 0;
while(iter < offset){
  //console.log(iter);
  nState = nextState(nState);
  iter++;
}


woods = 0;
lumber = 0;
nState.forEach(line=>line.split('').forEach(c=>{
  switch (c) {
    case '|':
      woods++;
      break;

    case '#':
      lumber++;
      break;

    default:
      break;
  }
}))
console.log('woods:', woods);
console.log('lumber:', lumber);
console.log('part2:', woods * lumber);


console.timeEnd('day18');
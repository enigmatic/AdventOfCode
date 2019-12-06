//Repeats after 125ish, use your calculator to solve the pattern :(

console.time('day12-2');
let generations = 200;//50000000000;


import readFile from '../lib/readFile';
const log = (message:any, ... optional:any[]) => {
  if (false)
    console.log(message, optional);
}

var data:string[] = readFile(__dirname + '\\input.txt');

let initialPots = data[0].substring(15);
let minPot = initialPots.length;
let maxPot = 0;
let firstPot = 0;

let pots:boolean[] = Array(initialPots.length).fill(false);

for (let i = 0; i < initialPots.length; i++) {
  if (initialPots[i] === '#') {
    if (minPot > i) minPot = i;
    pots[i] = true;
    maxPot = i;
  }
}

let grow:boolean[] =Array(32).fill(false);
data.forEach((value, idx) => {
  if (idx < 2) return;
  if (value.indexOf('=> .') !== -1) return;

  log(value);

  let growNum = value.substr(0,1) === '#'? 1: 0;
  growNum += value.substr(1,1) === '#'? 2: 0;
  growNum += value.substr(2,1) === '#'? 4: 0;
  growNum += value.substr(3,1) === '#'? 8: 0;
  growNum += value.substr(4,1) === '#'? 16: 0;

  grow[growNum] = true;
});

const willGrow = (ll:boolean, l:boolean, m:boolean, r:boolean, rr:boolean):boolean => {
  let growNum = ll ? 1: 0;
  growNum += l ? 2: 0;
  growNum += m ? 4: 0;
  growNum += r ? 8: 0;
  growNum += rr ? 16: 0;

  return grow[growNum];  
}

const growPots = (p:any):any => {
  let newSize = maxPot - minPot + 4;

  
  let lastPot = maxPot + 2;
  let newPots:boolean[] = Array(newSize).fill(false);
  
  let newFirstPot = minPot-2;
  let newMin = maxPot;
  let newMax = minPot;
  
  for (let potID = newFirstPot; potID < lastPot; potID++){
    let idx = potID - firstPot;
    if(willGrow(p[idx-2], p[idx-1],p[idx], p[idx+1], p[idx+2])) {
      let newIndex = potID - newFirstPot;
      newPots[newIndex] = true;
      
      if (newMin > potID) newMin = potID;
      newMax = potID;
    }
  }

  firstPot = newFirstPot;
  maxPot = newMax;
  minPot = newMin;
  return newPots;
}


const outputPots = (p:boolean[]) => {
  let str:string = '';
  for (let i = minPot; i < maxPot+1; i++) {
    str += p[i-firstPot] ? '#' : '.';
  }

  console.log(str, firstPot, potsValue(pots));
}

const potsValue = (p:boolean[]):number => {
  let totalV = 0;
  p.forEach((v, idx) => {
    if (v) {
      totalV += idx + firstPot;
    }
  })

  return totalV;
}
outputPots(pots);
let ogLen = maxPot - minPot;
for(var g = 0; g < generations; g++) {
  pots = growPots(pots);
  //if (pots.length === maxPot - minPot) outputPots(pots);
  outputPots(pots);

}

//outputPots(pots);
//console.log(potsValue(pots));
//console.log(minPot, maxPot, maxPot-minPot);
console.timeEnd('day12-2');
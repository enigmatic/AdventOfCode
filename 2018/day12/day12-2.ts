console.time('day12-2');
let generations = 2000;//50000000000;


import readFile from '../lib/readFile';
const log = (message:any, ... optional:any[]) => {
  if (false)
    console.log(message, optional);
}

var data:string[] = readFile(__dirname + '\\input.txt');

let initialPots = data[0].substring(15);
let pots:any = {};
let minPot = 1000;
let maxPot = -1;

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

const willGrow = (p:boolean[]) => {
  let growNum = p[0] ? 1: 0;
  growNum += p[1] ? 2: 0;
  growNum += p[2] ? 4: 0;
  growNum += p[3] ? 8: 0;
  growNum += p[4] ? 16: 0;

  return grow[growNum];  
}

const outputPots = (p:any) => {
  let str:string = '';

  for(let val = minPot; val < maxPot+1; val++) {
    str += p.hasOwnProperty(val) ? '#' : '.';
  }

  log(str);
}


const growPots = (p:any):any => {
  let potentials:any = {};
  const addPotential = (p:number, pos:number) => {
    if (!(potentials.hasOwnProperty(p))) {
      potentials[p] = 0;
    }
    potentials[p] += Math.pow(2,pos);
  }
  
  for (let idx in p) {
    let loc = parseInt(idx);
    addPotential(loc-2,4);
    addPotential(loc-1,3);
    addPotential(loc,2);
    addPotential(loc+1,1);
    addPotential(loc+2,0);
  }

  let newPots:any = {};
  let newMin = maxPot;
  let newMax = minPot;
  for (let idx in potentials) {
    let pot:number = potentials[idx];
    if (grow[pot]) {
      let loc = parseInt(idx);
      if (newMin > loc) newMin = loc;
      newPots[loc] = true;
      if (newMax < loc) newMax = loc;
    }
  }

  maxPot = newMax;
  minPot = newMin;
  return newPots;
}

const potsValue = (p:Object):number => {
  let totalV = 0;
  for (let idx in p) {
    totalV += parseInt(idx);
  }

  return totalV;
}

for(var g = 0; g < generations; g++) {
  pots = growPots(pots);
}
outputPots(pots);
//console.log(potsValue(pots));
console.log(minPot, maxPot, maxPot-minPot);
console.timeEnd('day12-2');
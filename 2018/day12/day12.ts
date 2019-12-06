console.time('day12');
let generations = 20;


import readFile from '../lib/readFile';
const log = (message:any, ... optional:any[]) => {
  if (true)
    console.log(message, optional);
}

var data:string[] = readFile(__dirname + '\\input.txt');

let initialPots = data[0].substring(15);
let pots:boolean[] = Array(initialPots.length + generations * 2).fill(false);

for (let i = 0; i < initialPots.length; i++) {
  if (initialPots[i] === '#') {
    pots[generations+i] = true;
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

const willGrow = (ll:boolean, l:boolean, m:boolean, r:boolean, rr:boolean) => {
  let growNum = ll ? 1: 0;
  growNum += l ? 2: 0;
  growNum += m ? 4: 0;
  growNum += r ? 8: 0;
  growNum += rr ? 16: 0;

  return grow[growNum];  
}

const outputPots = (p:boolean[]) => {
  let str:string = '';
  for (let val of p) {
    str += val ? '#' : '.';
  }

  log(str);
}

const growPots = (p:boolean[]):boolean[] => {
  return p.map((v, idx, a) => willGrow(a[idx-2], a[idx-1], v, a[idx+1], a[idx+2] ));
}

const potsValue = (p:boolean[]):number => {
  let totalV = 0;
  p.forEach((v, idx) => {
    if (v) {
      totalV += idx - generations;
    }
  })

  return totalV;
}

let np = pots;
for(var g = 0; g < generations; g++) {
  np = growPots(np);
}
outputPots(np);
console.log(potsValue(np));
console.timeEnd('day12');
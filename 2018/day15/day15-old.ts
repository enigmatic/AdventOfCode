console.time('day15');

import readFile from '../lib/readFile';
import { Pathfinder, Block, INavigationPathOptions, NavigationPath } from 'simple-pathfinder';

const pathOptions:INavigationPathOptions = {allowDiagonals:false};
let debug = false;
var data:string[] = readFile(__dirname + '\\example.txt');

class Mob {
  type:string = 'E';
  x: number = 0;
  y: number = 0;
  power = 3;
  hp = 200;
}

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

class Point {
  x = 0;
  y = 0;
  dist = 0;
  first:Direction = Direction.UP;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

let goblins = 0;
let elfs = 0;

let tiles:string[] = Array(data.length);
let mobs:Mob[] = [];
let mobPos:(Mob | null)[][] = Array(data.length);
for (let i = 0; i < data.length; i++) {
  mobPos[i] = Array<Mob>(data[0].length);
}
let deadMobs:Mob[] = [];

let obstacles:string[] = [];

data.forEach((line, idx)=>{
  tiles[idx] = line;
  for (let x = 0; x < line.length; x++) {
    if (line[x] === '#') obstacles.push(x.toString()+','+idx.toString());
    if (line[x] === "E" || line[x] === "G") {
      let m = new Mob();
      m.x = x;
      m.y = idx;
      m.type = line[x];
      mobs.push(m);
      mobPos[m.y][m.x] = m;
      obstacles.push(x.toString()+','+idx.toString());

      (m.type === "G") ? goblins++ : elfs++;
    }
  }
  tiles[idx] = tiles[idx].replace(/[EG]/g,'.');
});

let pathfinder:Pathfinder = new Pathfinder(data[0].length, data.length, obstacles);

function printMap() {
  
  for(let y = 0; y < tiles.length; y++) {
    let line = ''
    let printMobs:Set<Mob> = new Set();
    for(let x = 0; x < tiles[0].length; x++) {
      if (mobPos[y][x]) {
        line += (mobPos[y][x] as Mob).type;
        printMobs.add(mobPos[y][x] as Mob);
      }
      else {
        line += tiles[y].charAt(x);
      }
    }
    for(let m of printMobs) {
      line += ' ' + m.type + '(' + m.hp + ')';
    }
    console.log(line);
  }
}

function attack(mob:Mob) {
  let victim:Mob | null= null;
  function attackMob(potential:Mob | null) {
    if (!potential) return;
    if (potential.type === mob.type) return;
    if (!victim) {
      victim = potential;
      return;
    }
    if (victim.hp > potential.hp ) victim = potential
  }
  
  attackMob(mobPos[mob.y-1][mob.x]);
  attackMob(mobPos[mob.y][mob.x-1]);
  attackMob(mobPos[mob.y][mob.x+1]);
  attackMob(mobPos[mob.y+1][mob.x]);

  if (victim !== null){
    let vic:Mob = victim as Mob;
    vic.hp -= mob.power;
    if (vic.hp <= 0) { //dead
      (vic.type === "G") ? goblins-- : elfs--;
      deadMobs.push(vic);
      mobPos[vic.y][vic.x] = null;
      pathfinder.getBlockAtCoordinates(vic.x, vic.y).isBlocked = false;
    }
  }
}

function move(m:Mob) {
  //Check for neighbors don't move if there's someone to attack
  function checkNeighbor(potential:Mob | null): boolean {
    if (!potential) return false;
    if (potential.type === m.type) return false;
    return true;
  }
  
  if (checkNeighbor(mobPos[m.y-1][m.x]) ||
      checkNeighbor(mobPos[m.y][m.x-1]) ||
      checkNeighbor(mobPos[m.y][m.x+1]) ||
      checkNeighbor(mobPos[m.y+1][m.x])) {
        return;
      }
  

  //console.log(m);
  let dest:Block[] = [];
  //Potential Destinations

  mobs.forEach(mob => {
    //console.log('checking ', mob)
    if (mob.type !== m.type) {
      let adj:Block[] = pathfinder.getBlockAtCoordinates(mob.x,mob.y).getAdjacentBlocks(false,false)
      dest = [...dest, ...adj];
    }
  })

  //Eliminate Unreachable
  var paths:NavigationPath[] = [];
  let start:Block = pathfinder.getBlockAtCoordinates(m.x,m.y);
  //console.log(start.x, start.y);
  //start.isBlocked = false; // not Needed?
  let min = 64;
  dest.forEach(end => {
    try {
      let solution:NavigationPath = pathfinder.getNavigationPath(start, end, pathOptions);
      if (solution.path.length < min) {
        paths = [];
        min = solution.path.length;
        paths.push(solution);
      } else if (min === solution.path.length) {
        paths.push(solution);
      }
    } catch (error) {
      //No Solution
    }
  });

  if (paths.length === 0) return; //don't move if there's nowhere to go
  if (debug) console.log('Paths', paths.length);

  //Find Closest
  paths.sort((aSln, bSln) => {
    let a = aSln.getEndPoint();
    let b = bSln.getEndPoint();
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  //Possible Steps
  let minID = 0;
  if (min === 1) return; //don't move if adjacent
  
  let step:Block = paths[0].path[1];

  if (paths[0].path.length > 2 ) {
    let checkCorner = paths[0].path[2];
    let cornerAdj = checkCorner.getAdjacentBlocks(true, true);
    if (cornerAdj.indexOf(start) > -1) {
      console.log('Corner case for ', m)
      let adj = start.getAdjacentBlocks(false, false);
      console.log(adj.length, 'Adj length')
      adj.sort((a, b) => {
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });

      for (let b = 0; b < adj.length; b++) {
        if (cornerAdj.indexOf(adj[b]) !== undefined) {
          step = adj[b];
          break;
        }
      }
      
    }
  }
    
  start.isBlocked = false;
  step.isBlocked = true;
  mobPos[m.y][m.x] = null;
  m.y = step.y;
  m.x = step.x;
  mobPos[step.y][step.x] = m;
}


let iter = 0;
let fullIter = 0;
while (iter < 4) { //goblins > 0 && elfs > 0) {
  console.log(iter);
  printMap();
  mobs.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  for (let m = 0; m < mobs.length; m++) {
    if (mobs[m].hp <= 0) continue;
    if (debug) console.log('debugging', mobs[m]);
    move(mobs[m]);
    attack(mobs[m]);
    if(elfs === 0 || goblins === 0) {
      fullIter = iter;
      if (m === mobs.length-1) {
        fullIter++;
      }
      break;
    }
  }
  deadMobs.forEach(m => {
    let idx = mobs.indexOf(m);
    mobs.splice(idx, 1);
  });
  deadMobs = [];
  /*
  if (iter > 36){
    console.log(iter);
    printMap();
  }
  //*/
  iter++;
}
printMap();
let hpSum = mobs.reduce<number>((val, m) => val + m.hp, 0);
console.log(fullIter, hpSum, fullIter * hpSum);
console.timeEnd('day15');
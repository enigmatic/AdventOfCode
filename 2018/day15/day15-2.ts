//188576
console.time('day15');

import readFile from '../lib/readFile';

let debug = false;
let data: string[] = readFile(__dirname + '\\input.txt');

class Mob {
  type: string = 'E';
  x: number = 0;
  y: number = 0;
  power = 3;
  hp = 200;
}

class Point {
  x: number;
  y: number;
  distance: number;
  str: string;

  constructor(x: number, y: number, distance: number) {
    this.x = x;
    this.y = y;
    this.str = x.toString() + ',' + y.toString();
    this.distance = distance;
  }
}

function getNeighborCoords(y: number, x: number): Array<Array<number>> {
  return [
    [y - 1, x],
    [y, x - 1],
    [y, x + 1],
    [y + 1, x]
  ];
}

let goblins = 0;
let elfs = 0;

let tiles: string[] = Array(data.length);
let ogMobs: Mob[] = [];
let mobs: Mob[] = [];
let mobPos: (Mob | null)[][] = Array(data.length);
for (let i = 0; i < data.length; i++) {
  mobPos[i] = Array<Mob>(data[0].length);
}

data.forEach((line, idx) => {
  tiles[idx] = line;
  for (let x = 0; x < line.length; x++) {
    if (line[x] === 'E' || line[x] === 'G') {
      let m = new Mob();
      m.x = x;
      m.y = idx;
      m.type = line[x];
      ogMobs.push(m);
      mobPos[m.y][m.x] = m;

      m.type === 'G' ? goblins++ : elfs++;
    }
  }
  tiles[idx] = tiles[idx].replace(/[EG]/g, '.');
});

function printMap() {
  for (let y = 0; y < tiles.length; y++) {
    let line = '';
    let printMobs: Set<Mob> = new Set();
    for (let x = 0; x < tiles[0].length; x++) {
      if (mobPos[y][x]) {
        line += (mobPos[y][x] as Mob).type;
        printMobs.add(mobPos[y][x] as Mob);
      } else {
        line += tiles[y].charAt(x);
      }
    }
    for (let m of printMobs) {
      line += ' ' + m.type + '(' + m.hp + ')';
    }
    console.log(line);
  }
}

function findAttackTarget(mob: Mob): Mob | null {
  let targets = mobs.filter(
    v =>
      v.hp > 0 &&
      v.type !== mob.type &&
      ((Math.abs(v.x - mob.x) === 1 && v.y === mob.y) ||
        (Math.abs(v.y - mob.y) === 1 && v.x === mob.x))
  );

  if (targets.length === 0) return null;

  targets.sort((a, b) => {
    if (a.hp !== b.hp) return a.hp - b.hp;
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  return targets[0];
}

function attack(mob: Mob) {
  let targets = mobs.filter(
    v =>
      v.hp > 0 &&
      v.type !== mob.type &&
      ((Math.abs(v.x - mob.x) === 1 && v.y === mob.y) ||
        (Math.abs(v.y - mob.y) === 1 && v.x === mob.x))
  );

  if (targets.length === 0) return;

  targets.sort((a, b) => {
    if (a.hp !== b.hp) return a.hp - b.hp;
    if (a.y !== b.y) return a.y - b.y;
    return a.x - b.x;
  });

  let vic: Mob = targets[0];
  vic.hp -= mob.power;
  if (vic.hp <= 0) {
    //dead
    vic.type === 'G' ? goblins-- : elfs--;
    mobPos[vic.y][vic.x] = null;
  }
  //console.log('done attacking')
}

function move(m: Mob) {
  //console.log(m);
  let targets: Set<string> = new Set();

  mobs.forEach(v => {
    if (v.type !== m.type && v.hp > 0) {
      getNeighborCoords(v.y, v.x).forEach(c => {
        let n = mobPos[c[0]][c[1]];
        if (tiles[c[0]][c[1]] === '.' && !n)
          targets.add(c[1].toString() + ',' + c[0].toString());
      });
    }
  });

  //Potential Destinations
  let visited: Set<string> = new Set();
  let routes: Array<Array<Point>> = [[new Point(m.x, m.y, 0)]];
  let firstStep: Point | null = null;
  while (routes.length > 0 && firstStep === null) {
    let nextRoutes: Array<Array<Point>> = [];
    let targetRoutes: Array<Array<Point>> = [];

    routes.forEach(route => {
      let lastStep = route[route.length - 1];
      getNeighborCoords(lastStep.y, lastStep.x).forEach(v => {
        //console.log('searching...', v);
        let p = new Point(v[1], v[0], lastStep.distance + 1);
        if (targets.has(p.str)) {
          targetRoutes.push([...route, p]);
          //console.log('Target!!')
        } else if (
          !visited.has(p.str) &&
          tiles[p.y][p.x] === '.' &&
          !mobPos[p.y][p.x]
        ) {
          nextRoutes.push([...route, p]);
        }
        visited.add(p.str);
      });
    });

    if (targetRoutes.length > 0) {
      targetRoutes.sort((aR, bR) => {
        let a = aR[aR.length - 1];
        let b = bR[bR.length - 1];
        if (a.y !== b.y) return a.y - b.y;
        return a.x - b.x;
      });
      firstStep = targetRoutes[0][1];
      break;
    }

    routes = nextRoutes;
  }

  if (firstStep !== null) {
    //console.log(m, 'moving to', firstStep);
    mobPos[m.y][m.x] = null;
    m.y = firstStep.y;
    m.x = firstStep.x;
    mobPos[firstStep.y][firstStep.x] = m;
  }
}

//printMap();
let iter = 0;
let fullIter = 0;
let elfPower = 2;
let totalElfs = elfs;
let totalGobbos = goblins;
do {
  iter = 0;
  fullIter = 0;
  elfPower++;

  for (let i = 0; i < data.length; i++) {
    mobPos[i] = mobPos[i].fill(null);
  }

  mobs = [];
  ogMobs.forEach(ogMob => {
    let m = new Mob();
    m.x = ogMob.x;
    m.y = ogMob.y;
    m.type = ogMob.type;
    mobs.push(m);
    mobPos[m.y][m.x] = m;
  });
  elfs = totalElfs;
  goblins = totalGobbos;

  while (goblins > 0 && elfs === totalElfs && iter < 72) {
    mobs.sort((a, b) => {
      if (a.y !== b.y) return a.y - b.y;
      return a.x - b.x;
    });

    for (let m = 0; m < mobs.length; m++) {
      if (mobs[m].hp <= 0) continue;
      if (elfs === 0 || goblins === 0) {
        fullIter = iter;
        break;
      }
      if (debug) console.log('debugging', mobs[m]);

      let target = findAttackTarget(mobs[m]);
      if (!target) {
        move(mobs[m]);
        target = findAttackTarget(mobs[m]);
      }
      if (target) {
        if (mobs[m].type === 'G') target.hp -= mobs[m].power;
        else target.hp -= elfPower;

        if (target.hp <= 0) {
          //dead
          target.type === 'G' ? goblins-- : elfs--;
          mobPos[target.y][target.x] = null;
        }
      }
    }

    mobs = mobs.filter(m => m.hp > 0);
    /*
    if (iter >= 22){
      console.log(iter);
      printMap();
    }
    //*/
    iter++;
  }
} while (elfs !== totalElfs);

//printMap();
console.log('Power: ', elfPower);
let hpSum = mobs.reduce<number>((val, m) => val + m.hp, 0);
console.log(fullIter, hpSum, fullIter * hpSum);
console.timeEnd('day15');

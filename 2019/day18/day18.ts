import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const debugging = false;

const strData: string[] = readFile(__dirname + '/input.txt');
const mapData = strData.map(l => l.split(''));

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}
const mapList: CaveMap[] = [];

const efficiency: Map<string, CaveMap> = new Map();
class CaveMap {
  constructor(
    public keyString = '@:',
    public player = new Position(),
    public steps = 0
  ) {
    while (this.player.y === 0) {
      mapData.some((l, y) => {
        return l.some((v, x) => {
          if (v === '@') {
            this.player = new Position(x, y);
            return true;
          }
          return false;
        });
      });
    }
    //this.draw();
  }

  //target: Position;

  traverse(stopSteps = 1000000) {
    while (this.steps < stopSteps && this.findTargets()) {}
  }

  findTargets() {
    const visited: Set<string> = new Set();
    const targets: Position[] = [];
    let routes: Position[] = [this.player];

    const firstStep: Position | null = null;
    visited.add(this.player.toString());

    while (routes.length > 0) {
      const nextRoutes: Position[] = [];
      routes.forEach(lastStep => {
        lastStep.neighbors.forEach(v => {
          //console.log('searching...', v);
          const pStr = v.toString();
          if (visited.has(pStr)) {
            return;
          }
          v.z = lastStep.z + 1;
          const char = mapData[v.y][v.x];
          if (char === '.' || char === '@') {
            nextRoutes.push(v);
          } else if (char !== '#') {
            //console.log('Target!!')
            if (char.toUpperCase() === char) {
              //Door
              if (this.keyString.indexOf(char.toLowerCase()) > -1) {
                nextRoutes.push(v);
              }
            } else {
              //key
              if (this.keyString.indexOf(char) > -1) {
                nextRoutes.push(v);
              } else {
                targets.push(v);
              }
            }
          }
          visited.add(pStr);
        });
      });

      routes = nextRoutes;
    }

    //targets.sort((a, b) => a.z - b.z); //Closer first

    const keys = this.keyString.split(':')[1].split('');
    targets.forEach(t => {
      const charT = mapData[t.y][t.x];

      const keyList = Array.from(keys);
      keyList.push(charT);

      const mapKeyT = charT + ':' + keyList.sort().join('');
      const oldMapT = efficiency.get(mapKeyT);
      if (oldMapT) {
        if (oldMapT.steps <= this.steps + t.z) {
          return;
        }
      }
      const newMap = new CaveMap(
        mapKeyT,
        new Position(t.x, t.y),
        this.steps + t.z
      );
      mapList.push(newMap);
      if (oldMapT) {
        mapList.splice(mapList.indexOf(oldMapT), 1);
      }
      efficiency.set(mapKeyT, newMap);
    });
  }

  draw() {
    mapData.forEach(l => console.log(l.join('')));
  }
}

console.log('running Data');
console.time('part1');
mapList.push(new CaveMap());
let minSteps = 1000000000000;
while (mapList.length > 0) {
  const nextMap = mapList.shift() as CaveMap;
  nextMap.findTargets();
  if (nextMap.keyString.length === 28) {
    console.log(nextMap.keyString);
    minSteps = nextMap.steps;
    console.log(minSteps);
    break;
  }
  mapList.sort((a, b) => a.steps - b.steps);
}
console.log(minSteps);

console.timeEnd('part1');

console.log('part 2');

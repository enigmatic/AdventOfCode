import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const debugging = false;

const strData: string[] = readFile(__dirname + '/input-2.txt');
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
    public keyString = '@@@@:',
    public players: Position[] = [],
    public steps = 0
  ) {
    while (this.players.length < 4) {
      mapData.forEach((l, y) => {
        return l.forEach((v, x) => {
          if (v === '@') {
            const p = new Position(x, y);
            p.owner = this.players.length;
            this.players.push(p);
          }
        });
      });
    }
    //this.draw();
  }

  //target: Position;

  findTargets() {
    //console.log(this.keyString);
    const visited: Set<string> = new Set();
    const targets: Position[] = [];
    let routes: Position[] = this.players;

    const firstStep: Position | null = null;
    this.players.forEach(p => {
      visited.add(p.toString());
    });

    while (routes.length > 0) {
      const nextRoutes: Position[] = [];
      routes.forEach(lastStep => {
        lastStep.neighbors.forEach(v => {
          //console.log('searching...', v);
          const pStr = v.toString();
          if (visited.has(pStr)) {
            return;
          }
          v.owner = lastStep.owner;
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
      const locString = this.players.reduce((str, p, i) => {
        if (i === t.owner) {
          return str + mapData[t.y][t.x];
        }
        return str + mapData[p.y][p.x];
      }, '');

      const keyList = Array.from(keys);
      keyList.push(mapData[t.y][t.x]);

      const mapKeyT = locString + ':' + keyList.sort().join('');
      const oldMapT = efficiency.get(mapKeyT);
      if (oldMapT) {
        if (oldMapT.steps <= this.steps + t.z) {
          return;
        }
      }
      const newMap = new CaveMap(
        mapKeyT,
        this.players.map((p, i) => {
          if (i === t.owner) {
            const newP = new Position(t.x, t.y);
            newP.owner = t.owner;
            return newP;
          }
          return p;
        }),
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
console.time('part2');
mapList.push(new CaveMap());
let minSteps = 1000000000000;
while (mapList.length > 0) {
  const nextMap = mapList.shift() as CaveMap;
  nextMap.findTargets();
  if (nextMap.keyString.length === 26 + 5) {
    //31) {
    console.log(nextMap.keyString);
    minSteps = nextMap.steps;
    console.log(minSteps);
    break;
  }
  mapList.sort((a, b) => a.steps - b.steps);
}
console.log(minSteps);

console.timeEnd('part2');

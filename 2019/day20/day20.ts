import chai from 'chai';
import { ReadFile, Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const mapData = strData.map(l => l.split(''));
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

const mapList: CaveMap[] = [];

function getPoint(x: number, y: number): string {
  if (x < 0 || x >= mapData[0].length || y < 0 || y >= mapData.length) {
    return ' ';
  }
  return mapData[y][x];
}

const portalLookup: Map<string, Position[]> = new Map();
const portalHash: Map<string, string> = new Map();
const mapChars = ['#', '.', ' '];

function getNeighbors(p: Position) {
  const n = p.neighbors;
  if (portalHash.has(p.toXYString())) {
    const portal = String(portalHash.get(p.toXYString()));
    (portalLookup.get(portal) as Position[]).forEach(nTest => {
      if (p.x !== nTest.x || p.y !== nTest.y) {
        n.push(nTest);
      }
    });
  }

  return n;
}

class CaveMap {
  start = new Position();
  goal = new Position();
  constructor(public steps = 0) {
    mapData.forEach((l, y) => {
      l.forEach((v, x) => {
        if (mapChars.every(c => c !== v)) {
          const possible = [
            [1, 0],
            [0, 1]
          ];
          possible.some(n => {
            const test = getPoint(x + n[0], y + n[1]);

            if (mapChars.every(c => c !== test)) {
              let portalPosition = new Position(x - n[0], y - n[1]);
              if (getPoint(x + n[0] * 2, y + n[1] * 2) === '.') {
                portalPosition = new Position(x + n[0] * 2, y + n[1] * 2);
              }
              const portalName = v + test;
              if (portalName === 'AA') {
                this.start = portalPosition;
              } else if (portalName === 'ZZ') {
                this.goal = portalPosition;
              } else {
                if (portalLookup.has(portalName)) {
                  (portalLookup.get(portalName) as Array<Position>).push(
                    portalPosition
                  );
                } else {
                  portalLookup.set(portalName, [portalPosition]);
                }
                portalHash.set(portalPosition.toXYString(), portalName);
              }
              return true;
            }
            return false;
          });
        }
      });
    });

    //this.draw();
  }

  //target: Position;

  findTargets() {
    const visited: Set<string> = new Set();
    const targets: Position[] = [];
    let routes: Position[] = [this.start];

    visited.add(this.start.toXYString());

    while (routes.length > 0) {
      const nextRoutes: Position[] = [];
      routes.forEach(lastStep => {
        getNeighbors(lastStep).forEach(v => {
          //console.log('searching...', v);
          const pStr = v.toXYString();
          if (visited.has(pStr)) {
            return;
          }
          v.z = lastStep.z + 1;
          const char = getPoint(v.x, v.y);
          if (this.goal.x === v.x && this.goal.y === v.y) {
            targets.push(v);
          } else if (char === '.') {
            nextRoutes.push(v);
          }
          visited.add(pStr);
        });
      });

      routes = nextRoutes;
      routes.sort((a, b) => a.z - b.z); //Closer first
    }

    targets.sort((a, b) => a.z - b.z); //Closer first
    this.steps = targets[0].z;
  }

  draw() {
    mapData.forEach(l => console.log(l.join('')));
  }
}

console.log('running Data');
console.time('part1');
const map = new CaveMap();
map.findTargets();
console.log(map.steps);

console.timeEnd('part1');

console.log('part 2');

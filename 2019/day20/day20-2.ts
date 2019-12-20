import chai from 'chai';
import { ReadFile, Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';
import { Z_ASCII } from 'zlib';

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

class PortalEdge {
  public depth = 0;
  public steps = 0;
  constructor(public portalName = '', public dist = 0) {}
  toString(): string {
    return `${this.portalName}-${this.depth}`;
  }
}

const portalLookup: Map<string, PortalEdge[]> = new Map();
const portalHash: Map<string, string> = new Map();
const portalPositions: Map<string, Position> = new Map();
const mapChars = ['#', '.', ' '];

function getNeighbors(p: Position) {
  let n = p.neighbors;
  n = n.filter(nP => '.' === getPoint(nP.x, nP.y));
  n.forEach(nP => (nP.z = p.z));

  return n;
}

function getPortalNeighbors(p: PortalEdge): PortalEdge[] {
  const edges = (portalLookup.get(p.portalName) as PortalEdge[])
    .filter(
      e =>
        !(p.depth !== 0 && e.portalName.length === 2) &&
        !(p.depth === 0 && e.dist !== 1 && e.portalName.endsWith('o'))
    )
    .map(e => new PortalEdge(e.portalName, e.dist));

  edges.forEach(e => {
    e.depth = p.depth;
    if (e.dist === 1) {
      if (e.portalName.endsWith('o')) {
        e.depth = p.depth + 1;
      } else {
        e.depth = p.depth - 1;
      }
    }
  });

  return edges;
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

              let portalName = v + test;
              if (portalName === 'AA') {
                this.start = portalPosition;
              } else if (portalName === 'ZZ') {
                this.goal = portalPosition;
              } else {
                if (
                  x === 0 ||
                  x === mapData[0].length - 2 ||
                  y === 0 ||
                  y === mapData.length - 2
                ) {
                  portalName += 'o';
                } else {
                  portalName += 'i';
                }
              }
              portalHash.set(portalPosition.toXYString(), portalName);
              portalPositions.set(portalName, portalPosition);
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

  findPortalTargets(portalName: string) {
    const visited: Set<string> = new Set();
    const targets: PortalEdge[] = [];
    let routes: Position[] = [portalPositions.get(portalName) as Position];

    visited.add(this.start.toString());

    while (routes.length > 0) {
      const nextRoutes: Position[] = [];
      routes.forEach(lastStep => {
        getNeighbors(lastStep).forEach(v => {
          //console.log('searching...', v);
          const pStr = v.toXYString();
          if (visited.has(pStr)) {
            return;
          }
          v.steps = lastStep.steps + 1;
          if (portalHash.has(pStr)) {
            const name = portalHash.get(pStr);
            if (name !== portalName) {
              const edge = new PortalEdge(name, v.steps);
              targets.push(edge);
            }
          } else {
            nextRoutes.push(v);
          }
          visited.add(pStr);
        });
      });

      routes = nextRoutes;
    }
    if (portalName.length > 2) {
      const teleport = new PortalEdge(portalName.substr(0, 2), 1);
      if (portalName.charAt(2) === 'i') {
        teleport.portalName += 'o';
      } else {
        teleport.portalName += 'i';
      }
      targets.push(teleport);
    }

    portalLookup.set(portalName, targets);
  }
  findTargets() {
    for (const name of portalPositions.keys()) {
      this.findPortalTargets(name);
    }
  }

  getSteps(start: string, end: string): number {
    const visited: Set<string> = new Set();
    const routes: PortalEdge[] = [new PortalEdge(start, 0)];
    let minSteps = 0;

    visited.add(routes[0].toString());

    while (routes.length > 0 && minSteps === 0) {
      const lastStep = routes.shift() as PortalEdge;
      getPortalNeighbors(lastStep).forEach(v => {
        //console.log('searching...', v);
        const pStr = v.toString();
        if (visited.has(pStr)) {
          return;
        }
        v.steps = lastStep.steps + v.dist;
        if (v.portalName === end) {
          minSteps = v.steps;
        } else {
          routes.push(v);
        }
        visited.add(pStr);
      });

      routes.sort((a, b) => a.steps - b.steps);
    }

    return minSteps;
  }

  draw() {
    for (const key of portalLookup.keys()) {
      console.log(`${key} => `);
      (portalLookup.get(key) as PortalEdge[]).forEach(e =>
        console.log(`    ${e.portalName} : ${e.dist}`)
      );
    }
  }
}

console.log('running Data');
console.time('part2');
const map = new CaveMap();
map.findTargets();
//map.draw();
console.log(map.getSteps('AA', 'ZZ'));

console.timeEnd('part2');

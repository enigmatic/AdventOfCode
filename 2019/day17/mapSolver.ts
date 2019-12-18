import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';

const strData: string[] = readFile(__dirname + '/map.txt');

function cloneMap(map: string[][]): string[][] {
  return map.map(line => line.map(v => v));
}

const solverList: MapWalker[] = [];

class MapWalker {
  constructor(public mapData: string[][]) {}
  botPos: Position = new Position(48, 18);
  botFacing = 0;
  dirLog = '';
  walkDist = 0;
  posValue(p: Position) {
    if (p.y < 0 || p.y > 30) {
      return '.';
    }
    if (p.x < 0 || p.x > 50) {
      return '.';
    }
    return this.mapData[p.y][p.x];
  }

  get possibleSolution(): boolean {
    return !this.mapData.some(l => l.some(v => v === '#'));
  }

  solve() {
    while (this.botPos.x !== 28 || this.botPos.y !== 30) {
      const forwardPoint = this.botPos.neighbors[this.botFacing];
      if (this.posValue(forwardPoint) === '#') {
        this.walkDist++;

        this.botPos = forwardPoint;

        const exits = this.botPos.neighbors.reduce(
          (a, v) => (this.posValue(v) === '#' ? a + 1 : a),
          0
        );
        if (exits === 3) {
          //Intersection!
          let left = this.botFacing - 1;
          if (left < 0) {
            left = 3;
          }
          const leftSolver = new MapWalker(cloneMap(this.mapData));
          leftSolver.botPos = this.botPos;
          leftSolver.botFacing = left;
          leftSolver.dirLog = this.dirLog + this.walkDist.toString() + ',L,';
          solverList.push(leftSolver);

          let right = this.botFacing + 1;
          if (right === 4) {
            right = 0;
          }
          const rightSolver = new MapWalker(cloneMap(this.mapData));
          rightSolver.botPos = this.botPos;
          rightSolver.botFacing = right;
          rightSolver.dirLog = this.dirLog + this.walkDist.toString() + ',R,';
          solverList.push(rightSolver);
        } else {
          this.mapData[forwardPoint.y][forwardPoint.x] = '+';
        }
      } else {
        if (this.walkDist > 0) {
          this.dirLog += this.walkDist.toString() + ',';
        }
        this.walkDist = 0;
        let left = this.botFacing - 1;
        if (left < 0) {
          left = 3;
        }
        if (this.posValue(this.botPos.neighbors[left]) === '#') {
          this.dirLog += 'L,';

          this.botFacing = left;
        } else {
          let right = this.botFacing + 1;
          if (right === 4) {
            right = 0;
          }
          if (this.posValue(this.botPos.neighbors[right]) !== '#') {
            return;
          }
          this.dirLog += 'R,';
          this.botFacing = right;
        }
      }
    }
    this.dirLog += this.walkDist.toString();
  }
}

function elementCounter(commands: string): number {
  return commands.split(',').length;
}

solverList.push(new MapWalker(strData.map(l => l.split(''))));
while (solverList.length > 0) {
  const solver = solverList.shift() as MapWalker;
  solver.solve();
  if (solver.possibleSolution) {
    console.log(solver.dirLog);
  }
}

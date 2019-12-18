import chai from 'chai';
import chalk from 'chalk';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData;

function getNeighborCoords(p: Position): Array<Position> {
  return [
    new Position(p.x, p.y - 1),
    new Position(p.x - 1, p.y),
    new Position(p.x + 1, p.y),
    new Position(p.x, p.y + 1)
  ];
}

function getDir(start: Position, end: Position): number {
  if (end.y < start.y) {
    return 1;
  } else if (end.y > start.y) {
    return 2;
  } else if (end.x < start.x) {
    return 3;
  } else {
    return 4;
  }
}

class MazeRunner {
  codeRunner: IntCodeRunner;

  steps = 0;
  min = new Position();
  max = new Position();
  robot = new Position();
  moveTo = new Position();
  nextDestination = new Position(-14, -16, 0);
  target = new Position();
  walls = new Set<string>();
  visited = new Set<string>();
  potentials = new Map<string, Position>();

  constructor(private code: string) {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher());
    this.codeRunner.startRunner();
    this.visited.add(this.robot.toString());
  }

  draw() {
    console.clear();
    for (let y = this.min.y; y < this.max.y + 1; y++) {
      let line = '';
      for (let x = this.min.x; x < this.max.x + 1; x++) {
        const posStr = `${x},${y},0`;
        if (this.walls.has(posStr)) {
          line += chalk.bgWhite('#');
        } else if (this.robot.toString() === posStr) {
          line += chalk.red('+');
        } else if (
          this.nextDestination &&
          this.nextDestination.toString() === posStr
        ) {
          line += chalk.yellow('?');
        } else if (this.target.toString() === posStr) {
          line += chalk.green('t');
        } else if (this.visited.has(posStr)) {
          line += '.';
        } else {
          line += ' ';
        }
      }
      console.log(line);
    }
  }

  nextStep() {
    if (this.nextDestination === undefined) {
      return;
    }

    if (this.nextDestination.toString() === this.robot.toString()) {
      return;
    }

    if (this.nextDestination.taxiDistance(this.robot) === 1) {
      this.moveTo = this.nextDestination;
    } else {
      const visited: Set<string> = new Set();
      let routes: Array<Array<Position>> = [
        [new Position(this.robot.x, this.robot.y)]
      ];
      let firstStep: Position | null = null;
      while (routes.length > 0 && firstStep === null) {
        const nextRoutes: Array<Array<Position>> = [];
        const targetRoutes: Array<Array<Position>> = [];

        routes.forEach(route => {
          const lastStep = route[route.length - 1];
          getNeighborCoords(lastStep).forEach(v => {
            //console.log('searching...', v);
            const p = new Position(v.x, v.y, lastStep.z + 1);
            const pStr = `${p.x},${p.y},0`;
            if (
              this.nextDestination.x === p.x &&
              this.nextDestination.y === p.y
            ) {
              targetRoutes.push([...route, p]);
              //console.log('Target!!')
            } else if (!visited.has(pStr) && !this.walls.has(pStr)) {
              nextRoutes.push([...route, p]);
            }
            visited.add(pStr);
          });
        });

        if (targetRoutes.length > 0) {
          targetRoutes.sort((aR, bR) => {
            const a = aR[aR.length - 1];
            const b = bR[bR.length - 1];
            return a.taxiDistance(this.robot) - b.taxiDistance(this.robot);
          });
          firstStep = targetRoutes[0][1];
          break;
        }

        routes = nextRoutes;
      }

      this.moveTo = new Position(
        (firstStep as Position).x,
        (firstStep as Position).y
      );
    }

    this.potentials.delete(this.moveTo.toString());

    this.codeRunner.addInput(getDir(this.robot, this.moveTo));
  }

  outputCatcher() {
    const me = this;
    const inputPos = new Position();
    return (outNum: number) => {
      //console.log(`${me.moveTo.toString()}: ` + outNum);
      me.visited.add(me.moveTo.toString());
      if (me.moveTo.x < me.min.x) {
        me.min.x = me.moveTo.x;
      } else if (me.moveTo.x > me.max.x) {
        me.max.x = me.moveTo.x;
      }

      if (me.moveTo.y < me.min.y) {
        me.min.y = me.moveTo.y;
      } else if (me.moveTo.y > me.max.y) {
        me.max.y = me.moveTo.y;
      }

      switch (outNum) {
        case 0:
          me.walls.add(me.moveTo.toString());
          break;
        case 1:
          me.steps++;
          me.robot = me.moveTo;
          break;
        case 2:
          me.steps++;
          me.target = me.moveTo;
          me.robot = me.moveTo;
          console.log('Target Coords: ' + me.target.toString());
          break;

        default:
          break;
      }
    };
  }
}

console.log('running Data');
// tslint:disable-next-line: no-console
console.time('part1');

let mr = new MazeRunner(strData[0]);
while (mr.target.toString() === '0,0,0') {
  mr.nextStep();
  //  mr.draw();
}

mr.nextDestination = new Position();
while (mr.robot.toString() !== '0,0,0') {
  mr.nextStep();
  //mr.draw();
}

mr.nextDestination = new Position(-14, -16, 0);
mr.steps = 0;
while (mr.robot.toString() !== mr.nextDestination.toString()) {
  mr.nextStep();
  //mr.draw();
}
console.log(mr.steps);

// tslint:disable-next-line: no-console
console.timeEnd('part1');

console.log('part 2');
// tslint:disable-next-line: no-console
console.time('part2');

// tslint:disable-next-line: no-console
console.timeEnd('part2');

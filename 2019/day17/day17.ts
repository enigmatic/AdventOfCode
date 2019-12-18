import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}
const runData = strData[0];

class ScaffoldMap {
  solution = [
    'A,B,B,A,C,A,C,A,C,B',
    'L,6,R,12,R,8',
    'R,8,R,12,L,12',
    'R,12,L,12,L,4,L,4'
  ];
  constructor(private code: string, solve = false) {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher(), solve);
    if (solve) {
      this.codeRunner.setMemory(0, 2);
      this.codeRunner.startRunner();
      this.inputString(this.solution[0]);
      this.inputString(this.solution[1]);
      this.inputString(this.solution[2]);
      this.inputString(this.solution[3]);
      this.inputString('n');
    }
    if (this.line.length > 0) {
      this.lines.push(this.line);
    }
  }
  codeRunner: IntCodeRunner;

  lines: string[] = [];
  private line = '';
  public lastOutput = 0;

  inputString(str: string) {
    for (let i = 0; i < str.length; i++) {
      this.codeRunner.addInput(str.charCodeAt(i));
    }
    this.codeRunner.addInput(10);
  }

  outputCatcher() {
    const me = this;
    return (outNum: number) => {
      me.lastOutput = outNum;
      if (outNum === 10) {
        me.lines.push(me.line);
        me.line = '';
      } else {
        me.line += String.fromCharCode(outNum);
      }
    };
  }

  sumAlignment(): number {
    return this.lines.reduce((a, l, y) => {
      if (y === 0 || y === this.lines.length - 1) {
        return a;
      }
      return (
        a +
        l.split('').reduce((xA, c, x) => {
          if (x === 0 || x === l.length - 1 || c === '.') {
            return xA;
          }
          if (
            this.lines[y - 1].charAt(x) !== '.' &&
            l.charAt(x - 1) !== '.' &&
            l.charAt(x + 1) !== '.'
          ) {
            return xA + x * y;
          }
          return xA;
        }, 0)
      );
    }, 0);
  }

  draw() {
    this.lines.forEach(l => console.log(l));
  }
}

console.log('running Data');
console.time('part1');
const dataMap = new ScaffoldMap(runData);
const sAlign = dataMap.sumAlignment();
console.log(sAlign);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
const solveMap = new ScaffoldMap(runData, true);
solveMap.draw();
console.log(solveMap.lastOutput);
console.timeEnd('part2');

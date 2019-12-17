import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '/input.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}
const runData = strData[0];

class ScaffoldMap {
  constructor(private code: string) {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher());
    if (this.line.length > 0) {
      this.lines.push(this.line);
    }
  }
  codeRunner: IntCodeRunner;

  lines: string[] = [];
  private line = '';
  public lastOutput = 0;

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

console.timeEnd('part2');

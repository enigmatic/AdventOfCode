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

class SpringBot {
  solution1 = [
    'OR A J',
    'AND B J',
    'AND C J',
    'NOT J J',
    'AND D J',
  ];
  solution2 = [
    'OR A J',
    'AND B J',
    'AND C J',
    'NOT J J',
    'AND D J',
    'OR H T',
    'OR E T',
    'AND T J'
  ];
  constructor(private code: string, part2 = false) {
    this.codeRunner = new IntCodeRunner(this.code, this.outputCatcher());
    if (part2 )  {
      this.solution2.forEach(v => this.inputString(v));
      this.inputString('RUN');
      } else {
    this.solution1.forEach(v => this.inputString(v));
    this.inputString('WALK');
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
        console.log(me.line);
        me.lines.push(me.line);
        me.line = '';
      } else {
        me.line += String.fromCharCode(outNum);
      }
    };
  }

  draw() {
    this.lines.forEach(l => console.log(l));
  }
}

console.log('running Data');
console.time('part1');
const bot = new SpringBot(runData);
console.log(bot.lastOutput);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
const bot2 = new SpringBot(runData, true);
console.log(bot2.lastOutput);

console.timeEnd('part2');


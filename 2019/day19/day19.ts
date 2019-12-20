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

function testPoint(x: number, y: number): number {
  let output = 0;
  const codeRunner = new IntCodeRunner(runData, (outNum: number) => {
    output = outNum;
  });
  codeRunner.addInput(x);
  codeRunner.addInput(y);

  return output;
}

class TractorBeamMap {
  constructor() {
    let y = 755;
    const xStart = 4;

    let xEnd = 700;
    let looking = true;
    while (looking) {
      /*while (testPoint(xStart, y) === 0) {
        xStart++;
      }*/
      while (testPoint(xEnd, y) === 1) {
        xEnd++;
      }
      if (testPoint(xEnd - 100, y + 99) === 1) {
        looking = false;
        console.log(xEnd - 100, y);
      }
      /*
      let line = '.'.repeat(xStart);
      line += '#'.repeat(xEnd - xStart);
      line += '.'.repeat(50 - xEnd);
      console.log(line);
      */
      y++;
      //this.lines.push(line);
    }
  }

  affected = 0;
  lines: string[] = [];
  public lastOutput = 0;

  draw() {
    this.lines.forEach(l => console.log(l));
  }
}

console.log('running Data');
console.time('part1');
const dataMap = new TractorBeamMap();
//dataMap.draw();
console.log(dataMap.affected);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.timeEnd('part2');

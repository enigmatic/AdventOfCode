import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

class Pointer {
  accumulator: number = 0;
  instruction:number = 0;
}

function findLoop(program:string[]): Pointer {
  const p = new Pointer();
  const testSet = new Set<number>();
  let backJump = false;
  while (!backJump && p.instruction < program.length) {
    const [instruction, value] = program[p.instruction].split(' ');
    if (testSet.has(p.instruction)) break;
    testSet.add(p.instruction);
    switch (instruction) {
      case 'jmp':
        const diff = parseInt(value);
        p.instruction += diff;
        break;
      case 'acc':
        p.accumulator += parseInt(value);
      case 'noop':
      default:
        p.instruction++;
        break;
    }
  }

  return p;
}

function fixLoop(program:string[]): Pointer {
  const goal = program.length;
  let p = findLoop(program);
  let iTest = 0;
  while(p.instruction < goal && iTest < goal) {
    const newProgram = program.map(s => s);
    let noFix = true
    while (noFix && iTest < goal) {
      let tryLine = newProgram[iTest];
      if (!tryLine.match('acc')) {
        if (tryLine.match('nop')) {
          newProgram[iTest] = tryLine.replace('nop', 'jmp');
        } else {
          newProgram[iTest] = tryLine.replace('jmp', 'nop');
        }
        noFix = false;
      }
      iTest++;
    }
    p = findLoop(newProgram);
  }
  return p;
}

function tests() {
  chai.expect(findLoop(sampleData).accumulator).to.eq(5);
  chai.expect(fixLoop(sampleData).accumulator).to.eq(8);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(findLoop(strData).accumulator)
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(fixLoop(strData).accumulator)

console.timeEnd('part2');

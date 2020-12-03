import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const debugging = true;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function validPassLine(line:string):boolean {
  const elems = line.split(' ');
  const minmax = elems[0].split('-').map(v => parseInt(v));
  const letter = elems[1].split(':')[0];
  const count = elems[2].split('').reduce((acc, v)=> v === letter ? acc+1:acc, 0);
  return count >= minmax[0] && count <= minmax[1]; 
}

function validPassV2(line:string):boolean {
  const elems = line.split(' ');
  
  const letter = elems[1].split(':')[0];
  const strArray = elems[2].split('');
  const count = elems[0].split('-').map(v => parseInt(v) - 1).reduce((acc, v) => strArray[v] === letter? acc + 1: acc, 0);
  return count === 1;
}

function tests() {
  chai.expect(validPassLine('1-3 a: abcde')).true;
  chai.expect(validPassLine('1-3 b: cdefg')).false;
  chai.expect(validPassLine('2-9 c: ccccccccc')).true;
  chai.expect(validPassV2('1-3 a: abcde')).true;
  chai.expect(validPassV2('1-3 b: cdefg')).false;
  chai.expect(validPassV2('2-9 c: ccccccccc')).false;
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(strData.reduce((acc, v) => validPassLine(v) ? acc + 1 : acc, 0));
console.timeEnd('part1');

console.log('part 2');
console.time('part2');

console.log(strData.reduce((acc, v) => validPassV2(v) ? acc + 1 : acc, 0));
console.timeEnd('part2');

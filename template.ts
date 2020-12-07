import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
//const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function tests() {
  //chai.expect.
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');

console.timeEnd('part1');

console.log('part 2');
console.time('part2');

console.timeEnd('part2');

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

function findError(data:string[], preamble: number):number {
  let start = 0;
  let end = preamble;
  const numbers = data.map(v=>parseInt(v));

  while(end < data.length) {
    let sum = numbers[end];
    const pNums = numbers.filter((v, i) => i >= start && i < end);
    if (!pNums.find(v => pNums.some(k => k !== v && v + k === sum))) return sum;
    start++;
    end++;
  };
  return -1;
}

function findWeakness(data:string[], target: number):number {
  let start = -1;
  const numbers = data.map(v=>parseInt(v));
  let smallest = 0;
  let largest = 0;
  let sum = 0;
  while (sum !== target) {
    start++;
    smallest = numbers[start];
    largest = numbers[start];
    let end = start;
    sum = numbers[start];
    while (sum < target) {
      end++;
      const next = numbers[end];
      smallest = Math.min(smallest, next);
      largest = Math.max(largest, next);
      sum += next;
    }
  }
  return smallest + largest;
}

function tests() {
  chai.expect(findError(sampleData, 5)).to.eq(127);
  chai.expect(findWeakness(sampleData, 127)).to.eq(62);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
const target = findError(strData, 25);
console.log(target);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(findWeakness(strData, target));

console.timeEnd('part2');

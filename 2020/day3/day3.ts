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

function treeCount(x:number, y: number, treeMap: string[]):number {
  let posX = 0;
  let treeCounter = 0;
  for (let posY = y; posY < treeMap.length; posY += y) {

    const row = treeMap[posY].split('');
    posX += x;
    if (posX >= row.length) {
      posX -= row.length
    }
    if (row[posX] === '#') treeCounter++;
    debug(row.map((v, i) => i === posX ? v === '#' ? 'X' : 'O' : v).join(''));
  }
  return treeCounter;
}

const testArray = [[1,1], [3,1], [5,1], [7,1], [1,2]]

function tests() {
  chai.expect(treeCount(3, 1, sampleData)).to.equal(7);
  chai.expect(testArray.map(v => treeCount(v[0], v[1], sampleData))
  .reduce((acc, v) => acc * v, 1)).to.equal(336);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(treeCount(3, 1, strData));

console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(testArray.map(v => treeCount(v[0], v[1], strData))
  .reduce((acc, v) => acc * v, 1));
console.timeEnd('part2');

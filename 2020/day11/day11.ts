import chai from 'chai';
import { getLineAndCharacterOfPosition } from 'typescript';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function test(x:number, y:number, data:string[]): string {
  if ((x >= 0) && (y >= 0) && (x < data[0].length) && (y < data.length)) {
    return data[y][x];
  }

  return ' ';  
}

function neighbors(x:number, y:number, data:string[], deep: boolean): number {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx !== 0 || dy !== 0) {
        if (deep) {
          let depth = 1;
          let result = '.';

          while (result === '.') {
            result = test(x + depth * dx, y + depth * dy, data)
            depth++;
          }
          if (result === '#'){
            count += 1;
          }

        }
        else {
          if (test(x + dx, y + dy, data) === '#'){
            count += 1;
          }
        }
      }
    }
  }
  return count;
}

function iterate(data:string[], emptyThreshold = 4, deep = false): [number, string[]] {
  let changes = 0;
  const nextStep = data.map((line, idy, data) => {
    return line.split('').map((c,idx) => {
      if (c === '.') return c;

      const n = neighbors(idx, idy, data, deep) ;
      if (n === 0 && c !== '#') {
        changes++;
        return '#';
      }
      if (n >= emptyThreshold && c !== 'L') {
        changes++;
        return 'L';
      }
      return c;
    }).join('')
    
  }); 
  return [changes, nextStep];
}

function countOccupied(data:string[]): number {
  return data.reduce((acc, line) => acc + line.split('').reduce((acc, c) => c === '#' ? acc + 1 : acc, 0), 0);
}

function tests() {
  let counter = [1, sampleData];
  while(counter[0] > 0) {
    counter = iterate(counter[1] as string[]);
  }
  chai.expect(countOccupied(counter[1] as string[])).to.eq(37);

  counter = [1, sampleData];
  while(counter[0] > 0) {
    counter = iterate(counter[1] as string[], 5, true);
  }
  chai.expect(countOccupied(counter[1] as string[])).to.eq(26);
  
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');

let counter = [1, strData];
while(counter[0] > 0) {
  counter = iterate(counter[1] as string[]);
}
console.log(countOccupied(counter[1] as string[]));

console.timeEnd('part1');

console.log('part 2');
console.time('part2');
counter = [1, strData];
while(counter[0] > 0) {
  counter = iterate(counter[1] as string[], 5, true);
}
console.log(countOccupied(counter[1] as string[]));

console.timeEnd('part2');

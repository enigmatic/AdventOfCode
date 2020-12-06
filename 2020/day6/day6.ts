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

function tests() {
  let total = 0;
  let totalp2 = 0;
  let first = true;
  const yesSet = new Set<string>();
  const yesSet2 = new Set<string>();
  for (const line of sampleData) {
    if (line.length === 0) {
      total += yesSet.size;
      totalp2 += yesSet2.size;
      yesSet.clear();
      yesSet2.clear();
      first = true;
      continue;
    }
    line.split('').forEach(c => { 
      yesSet.add(c);
      if (first) {
        yesSet2.add(c);
      } else {
      }
    });

    if (!first) {
      yesSet2.forEach(c => {
        if (!line.match(c)) {
          yesSet2.delete(c);
        }
      })
    }
    
    first = false;
  }
  total += yesSet.size;
  totalp2 += yesSet2.size;
  chai.expect(total).to.equal(11)
  chai.expect(totalp2).to.equal(6)
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');

let total = 0;
let totalp2 = 0;
let first = true;
const yesSet = new Set<string>();
const yesSet2 = new Set<string>();
for (const line of strData) {
  if (line.length === 0) {
    total += yesSet.size;
    totalp2 += yesSet2.size;
    yesSet.clear();
    yesSet2.clear();
    first = true;
    continue;
  }
  line.split('').forEach(c => { 
    yesSet.add(c);
    if (first) {
      yesSet2.add(c);
    } else {
    }
  });

  if (!first) {
    yesSet2.forEach(c => {
      if (!line.match(c)) {
        yesSet2.delete(c);
      }
    })
  }
  
  first = false;
}
total += yesSet.size;
totalp2 += yesSet2.size;
console.log(total);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(totalp2);
console.timeEnd('part2');

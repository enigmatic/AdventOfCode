import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

//const strData: string[] = ReadFile(__dirname + '/input.txt');
//const sampleData: string[] = ReadFile(__dirname + '/sample1.txt');
const debugging = false;

class Constellation {
  merged = false;
  points: Array<number[]>;
  constructor(p:number[]) {
    this.points =[p];
  }

  checkAdd(p:number[]): boolean {
    if (this.points.some(v => v.reduce((a, n, i) => a + Math.abs(n - p[i]), 0) <= 3)) {
      this.points.push(p);
      return true;
    };
    return false;
  }
  
  check(p:number[]): boolean {
    if (this.points.some(v => v.reduce((a, n, i) => a + Math.abs(n - p[i]), 0) <= 3)) {
      return true;
    };
    return false;
  }
}

function findConstellations(filename:string): Constellation[] {
  const cList: Constellation[] = [];
  const sampleData: string[] = ReadFile(__dirname + '/' + filename);
  sampleData.forEach(line => {
    const p = line.split(',').map(c => parseInt(c));
    if (!cList.some(c => c.checkAdd(p))) {
      cList.push(new Constellation(p));
    }
  });

  cList.forEach(c => {
    if (c.merged) return;
    let allMerged = false;
    while(allMerged === false) {
      allMerged = true;
      cList.forEach(m => {
        if (m === c || m.merged) return;
        if (m.points.some(p => c.check(p))) {
          c.points.push(... m.points);
          m.merged = true;
          allMerged = false;
        }
      })
    }
  })

  return cList.filter(c => !c.merged);
}

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function tests() {
  
  const c1 = findConstellations('sample1.txt');
  chai.expect(c1.length).to.equal(2);
  const c2 = findConstellations('sample2.txt');
  chai.expect(c2.length).to.equal(4);
  
  const c3 = findConstellations('sample3.txt');
  chai.expect(c3.length).to.equal(3);
  
  const c4 = findConstellations('sample4.txt');
  chai.expect(c4.length).to.equal(8);
  
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(findConstellations('input.txt').length);

console.timeEnd('part1');

console.log('part 2');
console.time('part2');

console.timeEnd('part2');

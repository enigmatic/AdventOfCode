import chai from 'chai';
import { setPriority } from 'os';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function part1(data:string[]) {
  const timestamp = parseInt(data[0]);
  const list = data[1].split(',')
                      .filter(v=> v !== 'x')
                      .map(v=>parseInt(v))
                      .map(v => [v - (timestamp % v), v])
                      .sort((a,b)=> a[0] - b[0])
  return list[0][0]*list[0][1];
}

function part2(data:string, maxStart = -1){
  const list = data.split(',')
                      .map((v, i) => {return {value: v, index: i}})
                      .filter( v=>v.value !== 'x')
                      .map(v=>[parseInt(v.value ), v.index])
                      .sort((a,b)=> b[0] - a[0]);
  
  const max = list[0];
  let testMap = list.map(v => [v[0], v[1]-max[1]]);
  let testNum = 0;
  let stepSize = max[0];
  testMap.shift();
  let nextFind = testMap[0];
  let firstLoop = true;
  let bigStepStart = 0;
  while (testMap.length > 1 || firstLoop) {
    testNum += stepSize;
    
    if (((testNum + nextFind[1]) % nextFind[0]) === 0) {
      if (firstLoop) {
        bigStepStart = testNum;
        firstLoop = false;
      } else {
        testMap.shift();
        stepSize = testNum - bigStepStart;
        firstLoop = true;
        nextFind = testMap[0];
      }
    }
  }

  return testNum - max[1];
}

function tests() {
  chai.expect(part1(sampleData)).to.eq(295);
  chai.expect(part2("17,x,13,19")).to.eq(3417);
  chai.expect(part2("67,7,59,61")).to.eq(754018);
  chai.expect(part2(sampleData[1])).to.eq(1068781);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(part1(strData));
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(part2(strData[1],100000000000000));

console.timeEnd('part2');

import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sample1Data: string[] = ReadFile(__dirname + '/sample1.txt');
const sample2Data: string[] = ReadFile(__dirname + '/sample2.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function diffList(data:string[]) {
  const numbers = data.map(v => parseInt(v)).sort((a,b) => a-b);
  let diffArr = [0,0,0,0]
  diffArr[numbers[0]]++;
  for ( let i = 0; i < numbers.length-1; i++) {
    diffArr[numbers[i+1] - numbers[i]]++
  }
  diffArr[3]++;
  return diffArr;
}

function arrCount(arrNumbers: number[]): number {
  if (arrNumbers.length <= 2) return 1;
  const numbers = arrNumbers.map(v=>v);

  let lastnumber = numbers.shift();
  let arrangements = arrCount(numbers);

  if (numbers.length > 2) {
    if( lastnumber - numbers[2] <= 3) {
      arrangements += arrCount(numbers.slice(2));
    } 
  }

  if (numbers.length > 1) {
    if( lastnumber - numbers[1] <= 3) {
      arrangements += arrCount(numbers.slice(1));
    }
  }

  return arrangements;
}

function arrangements(data:string[]): number {
  const numbers = data.map(v => parseInt(v)).sort((a,b) => b-a);
  numbers.push(0);
  let groups:Array<number[]> = [];  
  let lastNum = numbers[0]+3;
  let nextGroup:number[] = [];

  while (numbers.length > 0) {
    let num = numbers.shift();
    if (lastNum - num  === 3) {
      nextGroup = [num];
      groups.push(nextGroup);
    } else {
      nextGroup.push(num);
    }

    lastNum = num;
  }

  return groups.reduce((acc, v) => acc * arrCount(v), 1);
  
}


function tests() {
  const d1 =diffList(sample1Data);
  chai.expect(d1[1]).to.eq(7);
  chai.expect(d1[3]).to.eq(5);
  const d2 =diffList(sample2Data);
  chai.expect(d2[1]).to.eq(22);
  chai.expect(d2[3]).to.eq(10);

  chai.expect(arrangements(sample1Data)).to.eq(8);
  chai.expect(arrangements(sample2Data)).to.eq(19208);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');

const d = diffList(strData);
console.log(d[1]*d[3])
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
console.log(arrangements(strData));

console.timeEnd('part2');

import chai from "chai";
import { ReadFile } from "../../lib/AdventOfCode";

const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function deal(n: number, len: number): number {
  return len - n - 1;
}

function cut(n: number, offset: number, len: number):number {
  if (offset < 0) {
    offset += len;
  }
  if (n < offset) {
    return n + len - offset;
  } else {
    return n - offset;
  }

  return n;
}

function reverseCut(n: number, offset: number, len: number):number {
  if (offset < 0) {
    offset += len;
  }
  if (n < offset) {
    return n + len - offset;
  } else {
    return n - offset;
  }
  return n;
}

function dealN(n: number, increment: number, len: number): number {
  return (n * increment) % len;
}
function reverseDealN(n: number, increment: number, len: number): number {
  let result = n / increment;
  let loops = 0;
  while (Math.floor(result) !== result)
  {
    loops++;
    result = (loops * len + n) / increment;
  }
  return result;
}

function processCommands(commands:string[], card:number, len:number):number {

  return commands.reduce((n, v) => {
    const vParts = v.split(' ');
    if (v.charAt(0) === 'c') {
      return cut(n,Number(vParts[1]), len);
    } else if (vParts[2] === 'new') {
      return deal(n, len);
    } else if (vParts[2] === 'increment') {
      return dealN(n, Number(vParts[3]), len);
    }
    return n;
  }, card);
}

function undoCommands(commands:string[], card:number, len:number):number {

  return commands.reduce((n, v) => {
    const vParts = v.split(' ');
    if (v.charAt(0) === 'c') {
      return reverseCut(n,Number(vParts[1]), len);
    } else if (vParts[2] === 'new') {
      return deal(n, len);
    } else if (vParts[2] === 'increment') {
      return reverseDealN(n, Number(vParts[3]), len);
    }
    return n;
  }, card);
}

function tests() {
  const testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  chai.assert.deepEqual(
    testArray.map(v => deal(v, testArray.length)),
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  );

  chai.assert.deepEqual(
    testArray.map(v => cut(v, 3, testArray.length)),
    [7, 8, 9, 0, 1, 2, 3, 4, 5, 6]
  );
  chai.assert.deepEqual(
    testArray.map(v => cut(v, -4, testArray.length)),
    [4, 5, 6, 7, 8, 9, 0, 1, 2, 3]
  );
  

  chai.assert.deepEqual(
    [3, 4, 5, 6, 7, 8, 9, 0, 1, 2].map(v => reverseCut(v, 3, testArray.length)),
    testArray
  );
  chai.assert.deepEqual(
    [4, 5, 6, 7, 8, 9, 0, 1, 2, 3].map(v => reverseCut(v, -4, testArray.length)),
    testArray
  );
  chai.assert.deepEqual(
    testArray.map(v => dealN(v, 3, testArray.length)),
    [0, 3, 6, 9, 2, 5, 8, 1, 4, 7]
  );
  chai.assert.deepEqual(reverseDealN(7, 3, 10), 9);

  let n7 = testArray.map(v => dealN(v, 7, testArray.length))
  chai.assert.deepEqual(n7.map(v=>reverseDealN(v,7,testArray.length)), testArray);
  const dealNArr = [0, 3, 6, 9, 2, 5, 8, 1, 4, 7];
  chai.assert.deepEqual(
    dealNArr.map(v => reverseDealN(v, 3, testArray.length)),
    testArray
  );

  const sampleData: string[] = ReadFile(__dirname + "\\sample1.txt");
  const revData = sampleData.reverse();
  const resultArr = testArray.map(v=>undoCommands(revData, v, testArray.length));
  const commandArr = [0,3,6,9,2,5,8,1,4,7];
  
  chai.assert.deepEqual(resultArr, commandArr);
}

tests();

console.log("running Data");
console.time("part1");

const strData: string[] = ReadFile(__dirname + "\\input.txt");
console.log(processCommands(strData,2019,10007));

console.timeEnd("part1");

console.log("part 2");
console.time("part2");

const revCommands = strData.reverse();

let val = 2020;
for (let i = 0; i < 101741582076661; i++){
  val = undoCommands(strData,val,119315717514047);
}
console.log(val);
console.timeEnd("part2");

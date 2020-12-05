import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function getRow(str:string):number {
  const rowMap = str.substr(0,7).split('');
  let max = 127;
  let min = 0;
  for (const row of rowMap) {
    let mid = Math.ceil((max - min) /2);
    if (row === 'B') {
      min += mid;
    } else {
      max -= mid;
    }
    
  }

  return max;

}

function getSeat(str:string): number {
  const rowMap = str.substr(7,3).split('');
  let max = 7;
  let min = 0;
  for (const row of rowMap) {
    let mid = Math.ceil((max-min )/ 2);
    if (row === 'R') {
      min += mid;
    } else {
      max -= mid;
    }
    
  }

  return max;

}

function seatID(row:number , seat:number): number {
  return row * 8 + seat;
}

function tests() {
  chai.expect(getRow('BFFFBBFRRR')).to.equal(70);
  chai.expect(getSeat('BFFFBBFRRR')).to.equal(7);
  chai.expect(seatID(70,7)).to.equal(567);
  chai.expect(getRow('FFFBBBFRRR')).to.equal(14);
  chai.expect(getSeat('FFFBBBFRRR')).to.equal(7);
  chai.expect(seatID(14,7)).to.equal(119);
  chai.expect(getRow('BBFFBBFRLL')).to.equal(102);
  chai.expect(getSeat('BBFFBBFRLL')).to.equal(4);
  chai.expect(seatID(102,4)).to.equal(820);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
let nArray:number[] = strData.map(v=>seatID(getRow(v), getSeat(v)));
const maxSeat = Math.max(...nArray)
console.log(maxSeat);

console.timeEnd('part1');

console.log('part 2');
console.time('part2');
for (let seat = 1; seat < maxSeat; seat++) {
  const seatSet:Set<number> = new Set<number>(nArray);
  if (!seatSet.has(seat) && seatSet.has(seat-1) && seatSet.has(seat+1)) {
    console.log(seat);
    break;
  }
}
console.timeEnd('part2');

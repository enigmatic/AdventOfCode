import chai from "chai";
import { ReadFile } from "../../lib/AdventOfCode";

const strData: string[] = ReadFile(__dirname + "/input.txt");
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function findPair(numArray: Array<number>, target: number): Array<number> {
  const pair: number[] = [];
  numArray.find((value, i) => {
    const match = numArray.find((v2, j) => {
      return value + v2 === target && i !== j;
    });

    if (match) {
      pair.push(value);
      pair.push(match);
      return true;
    }
    return false;
  });

  return pair;
}

function findTriplet(numArray: Array<number>, target: number): Array<number> {
  const triplet:number[] = [];
  numArray.find(value => {
    const p = findPair(numArray, target - value);
    if (p.length > 0) {
      triplet.push(value);
      triplet.push(p[0]);
      triplet.push(p[1]);
      return true;
    }
    return false;
  })
  return triplet;
}

function tests() {
  const testData = [1721, 979, 366, 299, 675, 1456];
  const p = findPair(testData, 2020);
  chai.assert.strictEqual(p[0] * p[1], 514579);
  const t = findTriplet(testData, 2020);
  chai.assert.strictEqual(t[0] * t[1] * t[2], 241861950);
}

console.log("running tests");
tests();

console.log("running Data");
const values = strData.map((value) => parseInt(value));
console.time("part1");
const p1 = findPair(
  values,
  2020
);
console.log(p1[0] * p1[1]);

console.timeEnd("part1");

console.log("part 2");
console.time("part2");
const t = findTriplet(values, 2020);
console.log(t[0] * t[1] * t[2]);

console.timeEnd("part2");

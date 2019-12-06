import chai from 'chai';
import readFile from '../../lib/readFile';

let strData: string[] = readFile(__dirname + '\\input.txt');
let debug = false;

function fuelNeed(mass: number): number {
  return Math.floor(mass / 3) - 2;
}

function tests() {
  chai.assert.strictEqual(fuelNeed(12), 2);
  chai.assert.strictEqual(fuelNeed(14), 2);
  chai.assert.strictEqual(fuelNeed(1969), 654);
  chai.assert.strictEqual(fuelNeed(100756), 33583);
}

console.log('running tests');
tests();

console.log(
  strData
    .map(i => Number(i))
    .reduce((a, v) => {
      let f = fuelNeed(v);
      let t = a + f;
      console.log(`${v} => ${f}  => ${t}`);
      return t;
    }, 0)
);

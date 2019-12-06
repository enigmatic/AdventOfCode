import chai from 'chai';
import readFile from '../../lib/readFile';

let strData: string[] = readFile(__dirname + '\\input.txt');
let debug = false;

function fuelNeed(mass: number): number {
  const f = Math.floor(mass / 3) - 2;
  if (f <= 0) {
    return 0;
  }
  return f + fuelNeed(f);
}

function tests() {
  chai.assert.strictEqual(fuelNeed(12), 2);
  chai.assert.strictEqual(fuelNeed(14), 2);
  chai.assert.strictEqual(fuelNeed(1969), 966);
  chai.assert.strictEqual(fuelNeed(100756), 50346);
}

console.log('running tests');
tests();

console.log(strData.map(i => Number(i)).reduce((a, v) => a + fuelNeed(v), 0));

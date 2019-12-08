import chai from 'chai';
import readFile from '../../lib/readFile';
import intCode from '../../lib/intcode';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData[0];

const sequenceLists: Array<Array<number>> = [];

const nums = [0, 1, 2, 3, 4];
nums.forEach((v1, i, arr) => {
  const sar = Array.from(arr);

  sar.splice(i, 1);

  sar.forEach((v2, i2, arr2) => {
    const sar2 = Array.from(arr2);

    sar2.splice(i2, 1);
    sar2.forEach((v3, i3, arr3) => {
      const sar3 = Array.from(arr3);
      sar3.splice(i3, 1);
      sar3.forEach((v4, i4, arr4) => {
        const sar4 = Array.from(arr4);
        sar4.splice(i4, 1);
        sar4.forEach(v5 => {
          sequenceLists.push([v1, v2, v3, v4, v5]);
        });
      });
    });
  });
});

function thrust(code: string, sequence: number[]): number {
  let result = 0;

  const outCatcher = (str: string) => {
    result = Number(str);
  };
  for (const phase of sequence) {
    const input = [phase, result];
    intCode(code, input, outCatcher);
  }

  return result;
}

function bestThrustSignal(code: string): number {
  return sequenceLists.reduce((a, v) => {
    const test = thrust(code, v);
    if (test > a) {
      return test;
    } else {
      return a;
    }
  }, 0);
}

function tests() {
  chai.assert.equal(
    thrust('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', [4, 3, 2, 1, 0]),
    43210
  );
  chai.assert.equal(
    bestThrustSignal('3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0'),
    43210
  );
  chai.assert.equal(
    bestThrustSignal(
      '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0'
    ),
    54321
  );
  chai.assert.equal(
    bestThrustSignal(
      '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0'
    ),
    65210
  );
}
tests();
console.log('running Data');
console.log(bestThrustSignal(runData));

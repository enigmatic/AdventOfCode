import chai from 'chai';
import readFile from '../../lib/readFile';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData[0];

const sequenceLists: Array<Array<number>> = [];

const nums = [5, 6, 7, 8, 9];
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

  const runners = [];
  for (const phase of sequence) {
    const runner = new IntCodeRunner(code, outCatcher);
    runners.push(runner);
    runner.addInput(phase);
  }

  let done = false;

  while (!done) {
    for (let i = 0; i < 5; i++) {
      runners[i].addInput(result);
      done = runners[4].done;
    }
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
    thrust(
      '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5',
      [9, 8, 7, 6, 5]
    ),
    139629729
  );
  chai.assert.equal(
    bestThrustSignal(
      '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5'
    ),
    139629729
  );
  chai.assert.equal(
    bestThrustSignal(
      '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10'
    ),
    18216
  );
}
tests();
console.log('running Data');
console.log(bestThrustSignal(runData));

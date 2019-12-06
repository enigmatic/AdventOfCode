import chai from 'chai';
import readFile from '../../lib/readFile';
import intCode from '../../lib/intcode';

let strData: string[] = readFile(__dirname + '\\input.txt');
let debug = false;

function tests() {
  chai.assert.equal(intCode('1,0,0,0,99').join(','), '2,0,0,0,99');
  chai.assert.equal(intCode('2,3,0,3,99').join(','), '2,3,0,6,99');
  chai.assert.equal(intCode('2,4,4,5,99,0').join(','), '2,4,4,5,99,9801');
  chai.assert.equal(
    intCode('1,1,1,4,99,5,6,0,99').join(','),
    '30,1,1,4,2,5,6,0,99'
  );
}

console.log('running tests');
tests();
let runData = strData[0].split(',');
runData[1] = '12';
runData[2] = '2';

console.log(intCode(runData.join(','))[0]);

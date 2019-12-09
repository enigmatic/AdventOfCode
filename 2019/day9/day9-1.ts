import chai from 'chai';
import readFile from '../../lib/readFile';
import IntCodeRunner from '../../lib/IntCodeRunner';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData[0];

console.log('running Data');
console.time('part1');
let runner = new IntCodeRunner(runData);
runner.addInput(1);
console.timeEnd('part1');

console.log('part 2');
console.time('part2');
runner = new IntCodeRunner(runData);
runner.addInput(2);
console.timeEnd('part2');

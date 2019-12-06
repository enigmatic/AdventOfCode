import chai from 'chai';
import readFile from '../../lib/readFile';
import intCode from '../../lib/intcode';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData[0];

console.log('running Data');
intCode(runData, [5]);

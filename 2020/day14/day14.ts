import chai from 'chai';
import { ReadFile } from '../../lib/AdventOfCode';

const strData: string[] = ReadFile(__dirname + '/input.txt');
const sampleData: string[] = ReadFile(__dirname + '/sample.txt');
const sample2Data: string[] = ReadFile(__dirname + '/sample2.txt');
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

function getNumber(x:number, mask:string[]): number {
  const binary = x.toString(2).padStart(mask.length,'X').split('');

  mask.forEach((v, i) => {
    if (v !== 'X') {
      binary[i] = v
    }
  });
  return parseInt(binary.map(v=> v==='X'? 0:v).join(''), 2);
}

function part1(data:string[]): number {
  const memory = new Map<number, number>()
  let mask: string[];
  data.forEach( line => {
    if (line.startsWith('mask')) {
      mask = line.substr(7).split('');
    } else {
      let memEnd = line.indexOf(']');
      const mem = parseInt(line.substr(4, memEnd));
      const number = parseInt(line.substr(4 + memEnd));
      memory.set(mem, getNumber(number, mask));
    }
  });

  return Array.from(memory.values()).reduce((a,v)=>v+a,0);
}

function mergeMask(x:number, mask:string[]):string {
  const binary = x.toString(2).padStart(mask.length,'0').split('');

  mask.forEach((v, i) => {
    if (v !== '0') {
      binary[i] = v
    }
  });

  return binary.join('');
}

function writeMemory(memory:Map<number, number>, startMask:string, value:number) {
  const masks = [startMask];
  const writeLocations:number[] = [];
  while (masks.length > 0) {
    let mask = masks.pop();
    const x = mask.indexOf('X');
    if (x === -1) {
      writeLocations.push(parseInt(mask, 2))
    } else {
    //console.log(`${mask} > `)
      for (let i = 0; i < 2; i++) {
        let newMask = mask.substr(0,x) + i.toString() + mask.substr(x+1);
        //console.log(`---- ${newMask}`);
        masks.push(newMask);
      }
    }
  }
  
  writeLocations.forEach(mem => memory.set(mem, value));
}

function part2(data:string[]): number {
  const memory = new Map<number, number>()
  let mask: string[];
  data.forEach( line => {
    if (line.startsWith('mask')) {
      mask = line.substr(7).split('');
    } else {
      let memEnd = line.indexOf(']');
      const mem = parseInt(line.substr(4, memEnd));
      const memoryMask = mergeMask(mem, mask);
      const num = parseInt(line.substr(4 + memEnd));
      writeMemory(memory, memoryMask, num);
    }
  });

  return Array.from(memory.values()).reduce((a,v)=>v+a,0);
}

function tests() {
  let mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X'.split('');
  chai.expect(getNumber(11, mask)).to.eq(73);
  chai.expect(getNumber(101, mask)).to.eq(101);
  chai.expect(getNumber(0, mask)).to.eq(64);

  chai.expect(part1(sampleData)).to.eq(165)

  chai.expect(part2(sample2Data)).to.eq(208);
}

console.log('running tests');
tests();

console.log('running Data');
console.time('part1');
console.log(part1(strData));
console.timeEnd('part1');

console.log('part 2');
console.time('part2');

console.log(part2(strData));
console.timeEnd('part2');

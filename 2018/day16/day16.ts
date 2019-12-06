console.time('day16');
import readFile from '../lib/readFile';

let debug = false;
var data:string[] = readFile(__dirname + '\\input1.txt');


let opcodes:Array<(registers:Array<number>, a:number, b:number, c:number)=>Array<number>> = Array(16).fill(-1);
let instructions:Array<(registers:Array<number>, a:number, b:number, c:number)=>Array<number>> = Array(16).fill(-1);
let potentials:Array<Set<number>> = Array(16);
for (let index = 0; index < 16; index++) {
  potentials[index]= new Set([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
}

opcodes[0] =function addr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a]+reg[b];
  return reg;
}

opcodes[1] = function addi(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a]+b;
  return reg;
}

opcodes[2] = function mulr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a]*reg[b];
  return reg;
}

opcodes[3] = function muli(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a]*b;
  return reg;
}

opcodes[4] = function banr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a] & reg[b];
  return reg;
}

opcodes[5] = function bani(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a] & b;
  return reg;
}


opcodes[6] = function borr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a] | reg[b];
  return reg;
}

opcodes[7] = function bori(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a] | b;
  return reg;
}

opcodes[8] = function setr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = reg[a];
  return reg;
}

opcodes[9] = function seti(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = a;
  return reg;
}

opcodes[10] = function gtir(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (a > reg[b])? 1: 0;
  return reg;
}

opcodes[11] = function gtri(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (reg[a] > b)? 1: 0;
  return reg;
}

opcodes[12] = function gtrr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (reg[a] > reg[b])? 1: 0;
  return reg;
}

opcodes[13] = function eqir(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (a === reg[b])? 1: 0;
  return reg;
}

opcodes[14] = function eqri(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (reg[a] === b)? 1: 0;
  return reg;
}

opcodes[15] = function eqrr(registers:Array<number>, a:number, b:number, c:number):Array<number> {
  let reg = registers.slice(0,4);
  reg[c] = (reg[a] === reg[b])? 1: 0;
  return reg;
}

function arrayEqual(a:Array<number>, b:Array<number>): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, idx) => v === b[idx]);
}

function testOpcode(registers:Array<number>, op:number, a:number, b:number, c:number, expected:Array<number>):number {
  return opcodes.reduce((count, value, idx)=>{
    let retRegs = value(registers, a, b, c);
    //console.log('Op',idx,'returned', retRegs);

    if ( arrayEqual(retRegs, expected) ) {
      return count+1;
    } else {
      potentials[op].delete(idx);
      return count;
    }
  }, 0);
}

//console.log('OpCode Test matches:',testOpcode([3, 2, 1, 1], 9, 2, 1, 2, [3, 2, 2, 1]));
let counter=0;
for (let lineNum = 0; lineNum < data.length; lineNum+=4) {
  const beforeStr = data[lineNum];
  const beforeReg:Array<number> = beforeStr.slice(9, 20).split(',').map<number>(v => parseInt(v));
  const ops = data[lineNum+1];
  const opArray = ops.split(' ').map<number>(v => parseInt(v));
  const afterStr = data[lineNum+2];
  const afterReg:Array<number> = afterStr.slice(9, 20).split(',').map<number>(v => parseInt(v));

  let count = testOpcode(beforeReg, opArray[0], opArray[1], opArray[2], opArray[3], afterReg);
  
  if (count > 2) counter++;

  //break; a
}
console.log('3+ potentials:', counter);

while(!potentials.every(v => v.size === 1)) {
  potentials.forEach((pset, op)=>{
    if (pset.size === 1 && instructions[op].toString() == '-1'){
      for (const v of pset) {
        potentials.forEach((pset, idx) =>{
          if (idx !== op) pset.delete(v);
        })
      }
    }
  })
}

console.log('checking op list');
potentials.map((v, i) => {
  for (const p of v) {
    instructions[i] = opcodes[p];
    console.log(i, '=>', p);
  }
})

let localRegisters = [0,0,0,0];
var instructionFile:string[] = readFile(__dirname + '\\input2.txt');
for (let line of instructionFile) {
  let ops = line.split(' ').map<number>(v => parseInt(v));
  //console.log(ops)
  let opFunc = instructions[ops[0]];
  localRegisters = opFunc(localRegisters, ops[1], ops[2], ops[3])
}

console.log(localRegisters);
console.timeEnd('day16');

console.time('day21');
import readFile from '../lib/readFile';
import { format } from 'util';

let debug = false;
var data:string[] = readFile(__dirname + '\\input.txt');


let opcodes:Map<string, (registers:Array<number>, a:number, b:number, c:number)=>Array<number>> = new Map();

opcodes.set('addr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a]+reg[b];
  return reg;
});

opcodes.set('addi',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a]+b;
  return reg;
});

opcodes.set('mulr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a]*reg[b];
  return reg;
});

opcodes.set('muli',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a]*b;
  return reg;
});

opcodes.set('banr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a] & reg[b];
  return reg;
});

opcodes.set('bani',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a] & b;
  return reg;
});


opcodes.set('borr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a] | reg[b];
  return reg;
});

opcodes.set('bori',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a] | b;
  return reg;
});

opcodes.set('setr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = reg[a];
  return reg;
});

opcodes.set('seti',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = a;
  return reg;
});

opcodes.set('gtir',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = (a > reg[b])? 1: 0;
  return reg;
});

opcodes.set('gtri',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = (reg[a] > b)? 1: 0;
  return reg;
});

opcodes.set('gtrr',(registers:Array<number>, a:number, b:number, c:number):Array<number> => {
  let reg = registers.slice(0,6);
  reg[c] = (reg[a] > reg[b])? 1: 0;
  return reg;
});

opcodes.set('eqir',(registers:Array<number>, a:number, b:number, c:number):Array<number>  => {
  let reg = registers.slice(0,6);
  reg[c] = (a === reg[b])? 1: 0;
  return reg;
});

opcodes.set('eqri',(registers:Array<number>, a:number, b:number, c:number):Array<number>  => {
  let reg = registers.slice(0,6);
  reg[c] = (reg[a] === b)? 1: 0;
  return reg;
});

opcodes.set('eqrr',(registers:Array<number>, a:number, b:number, c:number):Array<number>  => {
  let reg = registers.slice(0,6);
  reg[c] = (reg[a] === reg[b])? 1: 0;
  return reg;
});

let ip = 0;
let ipReg = 0;
type Instruction = {
  name:string,
  a:number, 
  b:number, 
  c:number
}

let instructions:Instruction[] = [];

data.forEach(line=>{
  if (debug) console.log(line, line.indexOf('#ip'))
  if (line.indexOf('#ip') !== -1) {
    ipReg = parseInt(line.substr(4));
    if (debug) console.log('IPReg Found:', ipReg)
  } else {
    let subline = line.split(' ')
    instructions.push({
      name:subline[0],
      a:parseInt(subline[1]),
      b:parseInt(subline[2]),
      c:parseInt(subline[3])
    });
    if (debug) console.log('Instruction:', instructions[instructions.length-1]);
  }
});

let registers = [0,0,0,0,0,0];
console.log('Starting with instruction: ', ip , registers[ip], registers);
let lastNum = 0;
let seenNumbers:Set<number> = new Set();
while(ip >= 0 && ip < instructions.length){
  let debugstr = "";
  registers[ipReg] = ip;
  let instr = instructions[ip];
  if (debug)
    debugstr = format('ip=' + ip, registers, instr.name, instr.a,instr.b, instr.c);

  
  
  registers = (opcodes.get(instr.name) as Function)(registers, instr.a, instr.b, instr.c);

  if (debug && ip === 28)
    console.log(debugstr, registers)
  
  if (ip === 24) registers[1] = Math.floor(registers[2] / 256);
  ip = registers[ipReg] +1;
  if (ip === 28) {
    if (seenNumbers.has(registers[3])) {
      console.log('Part 2:', lastNum);
      break;
    }
    lastNum = registers[3];
    
    if (seenNumbers.size === 0) {
      console.log('Part 1:', lastNum)
    }
    seenNumbers.add(lastNum);
  }

  //if (ip > 28) break;

}

console.log('Registers at end:',registers);

console.timeEnd('day21')
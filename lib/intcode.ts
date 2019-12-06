import chai from 'chai';
const debugging = false;

class Operation {
  opcode: number;
  modes: number[];

  constructor(instruction: number) {
    const params = 4;
    const iString = instruction.toString().padStart(params + 2, '0');

    this.modes = iString
      .substr(0, params)
      .split('')
      .map(v => Number(v))
      .reverse();

    this.opcode = Number(iString.substr(params));
  }
}

function intCode(
  prog: string,
  input: number[] = [],
  output: Function = console.log
): string[] {
  if (debugging) {
    // tslint:disable-next-line: no-console
    console.debug('-----Running Program-------');

    // tslint:disable-next-line: no-console
    console.debug(prog);
    // tslint:disable-next-line: no-console
    console.debug('---------------------------');
  }

  const code = prog.split(',').map(v => Number(v));

  const getValue = (val: number, mode: number) => {
    return mode === 0 ? code[val] : val;
  };

  let p = 0;

  let inputPointer = 0;
  let op = new Operation(code[p]);
  while (op.opcode > 0 && op.opcode < 9) {
    if (debugging) {
      // tslint:disable-next-line: no-console
      console.debug(
        `${code[p]}, ${code[p + 1]}:${getValue(code[p + 1], op.modes[0])}, ${
          code[p + 2]
        }:${getValue(code[p + 2], op.modes[1])}, ${code[p + 3]}:${getValue(
          code[p + 3],
          op.modes[2]
        )}`
      );
    }

    switch (op.opcode) {
      case 1: // ADD, X + Y => Z
        code[code[p + 3]] =
          getValue(code[p + 1], op.modes[0]) +
          getValue(code[p + 2], op.modes[1]);
        p += 4;
        break;

      case 2: // MUL, X * Y => Z
        code[code[p + 3]] =
          getValue(code[p + 1], op.modes[0]) *
          getValue(code[p + 2], op.modes[1]);
        p += 4;
        break;

      case 3: // INPUT, input => X
        code[code[p + 1]] = input[inputPointer];
        inputPointer++;
        p += 2;
        break;

      case 4: // OUTPUT, X => output
        output(getValue(code[p + 1], op.modes[0]));
        p += 2;
        break;

      case 5: //JUMP-IF-TRUE, X !== 0 ? Y => P
        if (getValue(code[p + 1], op.modes[0]) !== 0) {
          p = getValue(code[p + 2], op.modes[1]);
        } else {
          p += 3;
        }
        break;

      case 6: //JUMP-IF-FALSE, X === 0 ? Y => P
        if (getValue(code[p + 1], op.modes[0]) === 0) {
          p = getValue(code[p + 2], op.modes[1]);
        } else {
          p += 3;
        }
        break;

      case 7: //LESS THAN, X < Y ? 1 => Z : 0 => Z
        if (
          getValue(code[p + 1], op.modes[0]) <
          getValue(code[p + 2], op.modes[1])
        ) {
          code[code[p + 3]] = 1;
        } else {
          code[code[p + 3]] = 0;
        }
        p += 4;
        break;

      case 8: //EQUALS, X === Y ? 1 => Z : 0 => Z
        if (
          getValue(code[p + 1], op.modes[0]) ===
          getValue(code[p + 2], op.modes[1])
        ) {
          code[code[p + 3]] = 1;
        } else {
          code[code[p + 3]] = 0;
        }
        p += 4;
        break;

      default:
        break;
    }
    op = new Operation(code[p]);
  }

  if (op.opcode !== 99) {
    console.error(`IntCode Error: ${op.opcode} OpCode not recognized!`);
  }
  return code.map(v => v.toString());
}

function tests() {
  const tOp = new Operation(1002);
  chai.assert.equal(tOp.opcode, 2, 'Operation parses OpCode');
  chai.assert.equal(tOp.modes.join(','), '0,1,0,0', 'Operation parses Mode');

  chai.assert.equal(
    intCode('1,0,0,0,99').join(','),
    '2,0,0,0,99',
    'Opcode 1: 1+1=2'
  );
  chai.assert.equal(
    intCode('2,3,0,3,99').join(','),
    '2,3,0,6,99',
    'Opcode 2: 3*2=6'
  );
  chai.assert.equal(
    intCode('2,4,4,5,99,0').join(','),
    '2,4,4,5,99,9801',
    '99 * 99 = 9801'
  );
  chai.assert.equal(
    intCode('1,1,1,4,99,5,6,0,99').join(','),
    '30,1,1,4,2,5,6,0,99'
  );

  let output = '';
  const outHelper = (str: string) => {
    output += str;
  };
  chai.assert.equal(intCode('3,0,4,0,99', [5], outHelper)[0], '5');
  chai.assert.equal(output, '5', 'Input & Output (Opcodes 3&4)');

  chai.assert.equal(
    intCode('1002,4,3,4,33').join(','),
    '1002,4,3,4,99',
    'Mode 1 (immediate) works'
  );
  chai.assert.equal(
    intCode('1101,100,-1,4,0').join(','),
    '1101,100,-1,4,99',
    'Negative Numbers work'
  );

  output = '';
  let prog = '3,9,8,9,10,9,4,9,99,-1,8';
  intCode(prog, [8], outHelper);
  intCode(prog, [1], outHelper);
  chai.assert.equal(output, '10', 'Input Equals 8 using position mode');

  prog = '3,9,7,9,10,9,4,9,99,-1,8';
  output = '';
  intCode(prog, [1], outHelper);
  intCode(prog, [2], outHelper);
  intCode(prog, [8], outHelper);
  chai.assert.equal(output, '110', 'Input Less Than 8 using position mode');

  prog = '3,3,1108,-1,8,3,4,3,99';
  output = '';
  intCode(prog, [1], outHelper);
  intCode(prog, [2], outHelper);
  intCode(prog, [8], outHelper);
  chai.assert.equal(output, '001', 'Input Equals 8 using immediate mode');

  prog = '3,3,1107,-1,8,3,4,3,99';
  output = '';
  intCode(prog, [1], outHelper);
  intCode(prog, [2], outHelper);
  intCode(prog, [8], outHelper);
  chai.assert.equal(output, '110', 'Input Less Than 8 using immediate mode');

  prog = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9';
  output = '';
  intCode(prog, [2], outHelper);
  intCode(prog, [0], outHelper);
  intCode(prog, [8], outHelper);
  chai.assert.equal(
    output,
    '101',
    'jump tests: output 0 if input is 0, 1 otherwise, position mode'
  );

  prog = '3,3,1105,-1,9,1101,0,0,12,4,12,99,1';
  output = '';
  intCode(prog, [0], outHelper);
  intCode(prog, [2], outHelper);
  intCode(prog, [8], outHelper);
  chai.assert.equal(
    output,
    '011',
    'jump tests: output 0 if input is 0, 1 otherwise, immediate mode'
  );
}

console.log('Testing intCode');
tests();

export default intCode;

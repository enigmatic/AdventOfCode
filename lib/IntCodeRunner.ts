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

class IntCodeRunner {
  private _code: number[];
  private _input: number[] = [];
  private _p = 0;
  private _done = false;

  constructor(prog: string, private _output = console.log) {
    this._code = prog.split(',').map(v => Number(v));
    this.runCode();
  }

  public get code(): string {
    return this._code.join(',');
  }

  public get done(): boolean {
    return this._done;
  }

  public addInput(value: number) {
    this._input.push(value);
    this.runCode();
  }

  private runCode() {
    const getValue = (val: number, mode: number) => {
      return mode === 0 ? this._code[val] : val;
    };

    let inputPointer = 0;
    let op = new Operation(this._code[this._p]);
    while (op.opcode > 0 && op.opcode < 9) {
      switch (op.opcode) {
        case 1: // ADD, X + Y => Z
          this._code[this._code[this._p + 3]] =
            getValue(this._code[this._p + 1], op.modes[0]) +
            getValue(this._code[this._p + 2], op.modes[1]);
          this._p += 4;
          break;

        case 2: // MUL, X * Y => Z
          this._code[this._code[this._p + 3]] =
            getValue(this._code[this._p + 1], op.modes[0]) *
            getValue(this._code[this._p + 2], op.modes[1]);
          this._p += 4;
          break;

        case 3: // INPUT, input => X
          if (this._input.length > 0) {
            this._code[this._code[this._p + 1]] = this._input.shift() as number;
            inputPointer++;
            this._p += 2;
          } else {
            return;
          }
          break;

        case 4: // OUTPUT, X => output
          this._output(getValue(this._code[this._p + 1], op.modes[0]));
          this._p += 2;
          break;

        case 5: //JUMP-IF-TRUE, X !== 0 ? Y => P
          if (getValue(this._code[this._p + 1], op.modes[0]) !== 0) {
            this._p = getValue(this._code[this._p + 2], op.modes[1]);
          } else {
            this._p += 3;
          }
          break;

        case 6: //JUMP-IF-FALSE, X === 0 ? Y => P
          if (getValue(this._code[this._p + 1], op.modes[0]) === 0) {
            this._p = getValue(this._code[this._p + 2], op.modes[1]);
          } else {
            this._p += 3;
          }
          break;

        case 7: //LESS THAN, X < Y ? 1 => Z : 0 => Z
          if (
            getValue(this._code[this._p + 1], op.modes[0]) <
            getValue(this._code[this._p + 2], op.modes[1])
          ) {
            this._code[this._code[this._p + 3]] = 1;
          } else {
            this._code[this._code[this._p + 3]] = 0;
          }
          this._p += 4;
          break;

        case 8: //EQUALS, X === Y ? 1 => Z : 0 => Z
          if (
            getValue(this._code[this._p + 1], op.modes[0]) ===
            getValue(this._code[this._p + 2], op.modes[1])
          ) {
            this._code[this._code[this._p + 3]] = 1;
          } else {
            this._code[this._code[this._p + 3]] = 0;
          }
          this._p += 4;
          break;

        default:
          break;
      }
      op = new Operation(this._code[this._p]);
    }

    if (op.opcode !== 99) {
      console.error(`IntCode Error: ${op.opcode} OpCode not recognized!`);
    }

    this._done = true;
  }
}

function tests() {
  const tOp = new Operation(1002);
  chai.assert.equal(tOp.opcode, 2, 'Operation parses OpCode');
  chai.assert.equal(tOp.modes.join(','), '0,1,0,0', 'Operation parses Mode');

  let runner = new IntCodeRunner('1,0,0,0,99');
  chai.assert.equal(runner.code, '2,0,0,0,99', 'Opcode 1: 1+1=2');

  runner = new IntCodeRunner('2,3,0,3,99');
  chai.assert.equal(runner.code, '2,3,0,6,99', 'Opcode 2: 3*2=6');

  runner = new IntCodeRunner('2,4,4,5,99,0');
  chai.assert.equal(runner.code, '2,4,4,5,99,9801', '99 * 99 = 9801');

  runner = new IntCodeRunner('1,1,1,4,99,5,6,0,99');
  chai.assert.equal(runner.code, '30,1,1,4,2,5,6,0,99');

  let output = '';
  const outHelper = (str: string) => {
    output += str;
  };
  runner = new IntCodeRunner('3,0,4,0,99', outHelper);
  runner.addInput(5);
  chai.assert.equal(output, '5', 'Input & Output (Opcodes 3&4)');

  runner = new IntCodeRunner('1002,4,3,4,33');
  chai.assert.equal(runner.code, '1002,4,3,4,99', 'Mode 1 (immediate) works');

  runner = new IntCodeRunner('1101,100,-1,4,0');
  chai.assert.equal(runner.code, '1101,100,-1,4,99', 'Negative Numbers work');

  output = '';
  let prog = '3,9,8,9,10,9,4,9,99,-1,8';

  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);

  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(1);
  chai.assert.equal(output, '10', 'Input Equals 8 using position mode');

  prog = '3,9,7,9,10,9,4,9,99,-1,8';
  output = '';
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(1);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(2);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);
  chai.assert.equal(output, '110', 'Input Less Than 8 using position mode');
  prog = '3,3,1108,-1,8,3,4,3,99';

  output = '';
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(1);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(2);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);
  chai.assert.equal(output, '001', 'Input Equals 8 using immediate mode');

  prog = '3,3,1107,-1,8,3,4,3,99';
  output = '';
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(1);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(2);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);
  chai.assert.equal(output, '110', 'Input Less Than 8 using immediate mode');

  prog = '3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9';
  output = '';
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(2);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(0);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);
  chai.assert.equal(
    output,
    '101',
    'jump tests: output 0 if input is 0, 1 otherwise, position mode'
  );

  prog = '3,3,1105,-1,9,1101,0,0,12,4,12,99,1';
  output = '';
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(0);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(2);
  runner = new IntCodeRunner(prog, outHelper);
  runner.addInput(8);
  chai.assert.equal(
    output,
    '011',
    'jump tests: output 0 if input is 0, 1 otherwise, immediate mode'
  );

  runner = new IntCodeRunner(prog, outHelper);
  chai.assert.isFalse(runner.done);
  runner.addInput(0);
  chai.assert.isTrue(runner.done);
}

console.log('Testing IntCodeRunner');
tests();

export default IntCodeRunner;

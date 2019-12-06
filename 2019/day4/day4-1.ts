import chai from 'chai';

function isValidPW(pw: string): boolean {
  if (pw.length !== 6) return false;

  let double = false;
  let lastValue = pw.charCodeAt(0);
  for (let i = 1; i < pw.length; i++) {
    let nextValue = pw.charCodeAt(i);
    if (nextValue === lastValue) double = true;
    else if (nextValue < lastValue) return false;

    lastValue = nextValue;
  }

  return double;
}

class PasswordPossibilities implements IterableIterator<string> {
  pointer: number = 0;
  constructor(public start: number, public end: number) {
    this.pointer = start;
  }

  [Symbol.iterator](): IterableIterator<string> {
    return this;
  }

  public next(): IteratorResult<string> {
    if (this.pointer > this.end) {
      return {
        done: true,
        value: ''
      };
    }

    return {
      done: false,
      value: (this.pointer++).toString()
    };
  }
}

function tests() {
  chai.assert.isTrue(isValidPW('111111'));
  chai.assert.isFalse(isValidPW('223450'));
  chai.assert.isFalse(isValidPW('123789'));
  chai.assert.isFalse(isValidPW('1239'));
  chai.assert.isFalse(isValidPW('649729'));
  chai.assert.isFalse(isValidPW('193651'));
  chai.assert.isFalse(isValidPW('272265'));

  const possCheck = new PasswordPossibilities(0, 2);
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 0);

  let iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 1);
  chai.assert.equal(iter, { done: false, value: '0' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 2);
  chai.assert.equal(iter, { done: false, value: '1' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 3);
  chai.assert.equal(iter, { done: false, value: '2' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 3);
  chai.assert.equal(iter, { done: true, value: '' });
}

const possibleList = new PasswordPossibilities(193651, 649729);

let validPWs = 0;
for (let pw of possibleList) {
  if (isValidPW(pw)) {
    validPWs++;
  }
}

console.log(validPWs);

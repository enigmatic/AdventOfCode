console.time('day4-2');
import chai from 'chai';

function isValidPW(pw: string): boolean {
  if (pw.length !== 6) return false;

  let double = false;
  let doubleCount = 0;
  let lastValue = pw.charCodeAt(0);
  for (let i = 1; i < pw.length; i++) {
    let nextValue = pw.charCodeAt(i);
    if (nextValue === lastValue) {
      doubleCount++;
    } else if (nextValue < lastValue) {
      return false;
    } else {
      if (doubleCount === 1) double = true;
      doubleCount = 0;
    }

    lastValue = nextValue;
  }

  return double || doubleCount === 1;
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
  chai.assert.isTrue(isValidPW('112233'));
  chai.assert.isFalse(isValidPW('123444'));
  chai.assert.isTrue(isValidPW('111122'));
  chai.assert.isTrue(isValidPW('112222'));
  chai.assert.isFalse(isValidPW('111111'));
  chai.assert.isFalse(isValidPW('223450'));
  chai.assert.isFalse(isValidPW('123789'));
  chai.assert.isFalse(isValidPW('1239'));
  chai.assert.isFalse(isValidPW('649729'));
  chai.assert.isFalse(isValidPW('193651'));
  chai.assert.isFalse(isValidPW('272265'));
  chai.assert.isTrue(isValidPW('556667'));
  chai.assert.isTrue(isValidPW('577788'));

  const possCheck = new PasswordPossibilities(0, 2);
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 0);

  let iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 1);
  chai.assert.deepEqual(iter, { done: false, value: '0' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 2);
  chai.assert.deepEqual(iter, { done: false, value: '1' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 3);
  chai.assert.deepEqual(iter, { done: false, value: '2' });

  iter = possCheck.next();
  chai.assert.strictEqual(possCheck.start, 0);
  chai.assert.strictEqual(possCheck.end, 2);
  chai.assert.strictEqual(possCheck.pointer, 3);
  chai.assert.deepEqual(iter, { done: true, value: '' });
}
console.time('tests');
tests();
console.timeEnd('tests');

console.time('solution');
const possibleList = new PasswordPossibilities(193651, 649729);

let validPWs = 0;
for (let pw of possibleList) {
  if (isValidPW(pw)) {
    validPWs++;
  }
}

console.log(validPWs);
console.timeEnd('solution');
console.timeEnd('day4-2');

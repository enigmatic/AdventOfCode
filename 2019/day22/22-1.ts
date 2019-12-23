const bigintCryptoUtils = require('bigint-crypto-utils');
import { ReadFile } from '../../lib/AdventOfCode';

const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

const len = 119315717514047;
class deckKey {
  _offset = 0;
  constructor(newOffset = 0, public increment = 1) {
    this.offset = newOffset;
  }
  set offset(n: number) {
    if (n >= len) {
      this._offset = n - len;
    } else if (n < 0) {
      this._offset = n + len;
    } else {
      this._offset = n;
    }
  }

  get offset(): number {
    return this._offset;
  }
}

function processCommands(commands: string[]): deckKey {
  const offsetIncrement = [0, 1];

  return commands.reduce((n, v) => {
    const vParts = v.split(' ');
    if (v.charAt(0) === 'c') {
      n.offset += n.increment * Number(vParts[1]);
      return n;
    } else if (vParts[2] === 'new') {
      n.increment *= -1;
      n.offset += n.increment;
      return n;
    } else if (vParts[2] === 'increment') {
      n.increment =
        (n.increment *
          Number(bigintCryptoUtils.modInv(Number(vParts[3]), len))) %
        len;
      return n;
    }
    return n;
  }, new deckKey());
}

console.log('running Data');

console.time('part2');
const strData: string[] = ReadFile(__dirname + '/input.txt');
const result = processCommands(strData);
console.log(result);

const increment = Number(
  bigintCryptoUtils.modPow(result.increment, 101741582076661n, len)
);

const offset =
  ((result.offset *
    (1 - increment) *
    Number(bigintCryptoUtils.modInv(1 - result.increment, len))) %
    len) +
  len;

console.log(offset);
console.log((offset + increment * 2020) % len);

console.timeEnd('part2');
//11145301819040; low
//11145301819041;
//90866209291611; high

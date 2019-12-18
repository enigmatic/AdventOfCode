import chai from 'chai';
import readFile from '../../lib/readFile';
import { Position } from '../../lib/AdventOfCode';

const strData: string[] = readFile(__dirname + '\\input.txt');
const debug = false;
const runData = strData;

class ReactionComponent {
  constructor(public count = 1, public chemical = '') {}
}
class Reaction {
  inputs: ReactionComponent[] = [];
  output = new ReactionComponent();
}

function getReaction(reactString: string): Reaction {
  const reaction = new Reaction();
  const inOut = reactString.split(' => ');

  const reactComp = (str: string): ReactionComponent => {
    const comps = str.split(' ');
    return new ReactionComponent(Number(comps[0]), comps[1]);
  };

  reaction.output = reactComp(inOut[1]);
  inOut[0].split(', ').forEach(str => {
    reaction.inputs.push(reactComp(str));
  });

  return reaction;
}
function buildReactionList(text: string[]): Map<string, Reaction> {
  const rl = new Map<string, Reaction>();

  text.forEach(line => {
    const react = getReaction(line);
    rl.set(react.output.chemical, react);
  });

  return rl;
}

function oreNeeded(oreReactions: Map<string, Reaction>, fuel = 1): number {
  let ore = 0;

  const compsNeeded = [new ReactionComponent(fuel, 'FUEL')];
  const extraComponents = new Map<string, number>();

  while (compsNeeded.length > 0) {
    let need = compsNeeded.shift() as ReactionComponent;
    let react = oreReactions.get(need.chemical) as Reaction;
    let extras = 0;
    if (extraComponents.has(need.chemical)) {
      extras = Number(extraComponents.get(need.chemical));
    }

    const reactions = Math.ceil((need.count - extras) / react.output.count);
    react.inputs.forEach(r => {
      if (r.chemical === 'ORE') {
        ore += r.count * reactions;
      } else {
        compsNeeded.push(
          new ReactionComponent(reactions * r.count, r.chemical)
        );
      }
    });

    const total = extras + reactions * react.output.count;
    extraComponents.set(need.chemical, total - need.count);
  }

  return ore;
}

function tests() {
  console.log('running Tests');
  // tslint:disable-next-line: no-console
  console.time('tests');

  let testData: string[] = readFile(__dirname + '\\sample1.txt');

  let reaction = getReaction(
    '6 CXQB, 4 CKRP, 2 BXVL, 5 GZNJZ, 3 VWJS, 1 FLFT, 4 KPNWG => 7 DFCM'
  );
  chai.assert.equal(reaction.output.chemical, 'DFCM');
  chai.assert.equal(reaction.output.count, 7);
  chai.assert.equal(reaction.inputs.length, 7);

  let testReactions = buildReactionList(testData);
  chai.assert.equal(testReactions.size, 6);
  chai.assert.isTrue(testReactions.has('FUEL'));

  chai.assert.equal(oreNeeded(testReactions), 31);
  console.timeEnd('tests');
}

tests();

console.log('running Data');
// tslint:disable-next-line: no-console
console.time('part1');
let dataReactions = buildReactionList(strData);
const oreForOne = oreNeeded(dataReactions);
console.log(oreForOne);
// tslint:disable-next-line: no-console
console.timeEnd('part1');

console.log('part 2');
// tslint:disable-next-line: no-console
console.time('part2');
const maxOre = 1000000000000;
let minTry = maxOre / oreForOne;
let dist = 2;
let maxTry = minTry * dist;
while (Math.floor(minTry) !== Math.floor(maxTry)) {
  let maxResult = oreNeeded(dataReactions, maxTry);
  if (maxOre > maxResult) {
    minTry = maxTry;
    maxTry = maxTry + maxTry * dist;
  } else {
    dist = dist / 2;
    maxTry = minTry + minTry * dist;
  }
}

if (Math.ceil(maxTry) < maxOre) {
  console.log(Math.ceil(maxTry));
} else {
  console.log(Math.floor(maxTry));
}

// tslint:disable-next-line: no-console
console.timeEnd('part2');

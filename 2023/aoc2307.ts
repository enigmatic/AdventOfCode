import chai from "chai";
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

function cardValue(card:string):number {
  switch (card) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return 11;
    case 'T':
      return 10;
    case 'W':
      return 1;
    default:
      return parseInt(card);
  }
}

chai.expect(cardValue('5')).to.eq(5);
chai.expect(cardValue('A')).to.eq(14);
chai.expect(cardValue('J')).to.eq(11);
chai.expect(cardValue('W')).to.eq(1);

class CamelPokerHand {
  cards: string;
  bid: number;
  hand: number;

  constructor(line:string){
    let p = line.split(/\s+/);
    this.cards = p[0];
    this.bid = parseInt(p[1]);
    
    const counts = new Map<string, number>();
    this.cards.split('').forEach(function (x) { 
      let v = (counts.get(x) || 0) + 1;
      counts.set(x, v)  
    });

    const wilds = (counts.get('W') || 0);
    counts.delete('W');
    const values = Array.from(counts.values()).sort().reverse();
    
    this.hand = (values[0] || 0) + wilds;
    if (values.length > 1 && values[1] === 2) {
      this.hand += 0.5;
    }
  }
}

const testHand = new CamelPokerHand('32T3K 765');
const testHand2 = new CamelPokerHand('KTJJT 220');
const testHand3 = new CamelPokerHand('22A7J 490'.replace(/J/g,'W'));
const testHand4 = new CamelPokerHand('JJJJJ'.replace(/J/g,'W'));
chai.expect(testHand.bid).to.eq(765);
chai.expect(testHand.cards).to.eq('32T3K');
chai.expect(testHand.hand).to.eq(2);
chai.expect(testHand2.hand).to.eq(2.5);
chai.expect(testHand3.hand).to.eq(3);
chai.expect(testHand3.cards).to.eq('22A7W');
chai.expect(testHand4.cards).to.eq('WWWWW');
chai.expect(testHand4.hand).to.eq(5);

function sortCamelPokerHand(a:CamelPokerHand, b:CamelPokerHand): number {
  if (a.hand !== b.hand) return a.hand-b.hand;

  for (let i = 0; i < a.cards.length; i++) {
    if (a.cards[i] !== b.cards[i]) {
      return cardValue(a.cards[i]) - cardValue(b.cards[i]);
    }
  }
}

//Globals
let hands: Array<CamelPokerHand> = [];
function reset() {
  //Reset Globals here
  hands = [];
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();

  let answer: number | string = 0;

  //console.log(inputs);
  //console.log(additionalInfo);

  if (part === 1) {
    hands = inputs.map(l => new CamelPokerHand(l));
  } else {
    hands = inputs.map(l => {
      return new CamelPokerHand(l.replace(/J/g, 'W'))
    });
  }

  hands.sort(sortCamelPokerHand);
  answer = hands.reduce((p,v,i) => p + v.bid * (i+1), answer)

  //throw new Error("Not implemented"); // <-- Replace with your solution
  return answer;
}

run(__filename, solve);

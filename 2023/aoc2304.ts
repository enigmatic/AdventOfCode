import chai from "chai";
import { run } from 'aoc-copilot';

const debug = true;
function log(text:any): void {
    if (debug) {
        console.log(text);
    }
}

function matches(card: string): number {
  let splitVals = card.trim().split('|');
  let winners = splitVals[0].trim().split(/\s+/);

  var union = splitVals[1].trim().split(/\s+/).filter(v => winners.includes(v));

  return union.length;

}

function winningPoints(card: string): number {
  let points = matches(card)
  if (points === 0) {
    return 0;
  } 

  return Math.pow(2, points-1);
}

chai.expect(winningPoints(' 41 48 83 86 17 | 83 86  6 31 17  9 48 53')).to.eq(8);
chai.expect(winningPoints(' 13 32 20 16 61 | 61 30 68 82 17 32 24 19')).to.eq(2);
chai.expect(winningPoints(' 41 92 73 84 69 | 59 84 76 51 58  5 54 83')).to.eq(1);
chai.expect(winningPoints(' 87 83 26 28 32 | 88 30 70 12 93 22 82 36')).to.eq(0);
chai.expect(winningPoints(' 93 90 23 71 16 47 15 49 73 21 | 54 14 92 44 20 87 48  3 15 88 83  2 12 39 70 49 64 21 94 27 45 89 99 98  8')).to.eq(4);
chai.expect(winningPoints(' 75 39 34 23 61  3 68  1  7 87 |  4 68 75 39 82  7 10 67 71 38 34 96 49 26 63 14  1 29 61 54 98 87  3  9 23')).to.eq(512);

async function solve(
    inputs: string[], // Contents of the example or actual inputs
    part: number,     // Indicates whether the solver is being called for part 1 or 2 of the puzzle
    test: boolean,    // Indicates whether the solver is being run for an example or actual input
    additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
    let answer: number | string = 0;

    //log(inputs);
    //log(additionalInfo);
    if (part === 1) {
      answer = inputs.reduce((a, v) => {
        let cardParts = v.trim().split(':');
        let points = winningPoints(cardParts[1]);
        log(`${cardParts[0]}: ${points} points`)
        return a + points;
      }, answer);
    } else {

      let cardCount = new Map<number, number>();
      let cards = new Map<number, string>();
      let maxCard = -1;
      
      inputs.forEach(v => {
        let c = v.trim().split(':')
        let cardId = parseInt(c[0].split(/\s+/)[1]);
        cardCount.set(cardId, 1);
        cards.set(cardId, c[1]);
        maxCard = Math.max(maxCard, cardId);
      });
      log(`read ${maxCard} card`);

      for( let card = 1; card <= maxCard; card++) {
        let m = matches(cards.get(card));
        let c = cardCount.get(card);
        log(`Card ${card} (${c} copies): ${m} Matches`);
        for (let i = 1; i <= m; i++) {
          cardCount.set(card+i, cardCount.get(card+i) + c);
        }
      }

      answer = Array.from(cardCount.values()).reduce((p, v)=> p+v, 0);

    }
    
    return answer;
}

run(__filename, solve);

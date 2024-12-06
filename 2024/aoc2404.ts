import { expect } from 'earl';
import { run } from "aoc-copilot";
import { Position } from '../lib/AdventOfCode';

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

//Globals
var gInputs: string[];
function reset() {
  //Reset Globals here
}

class SearchPosition extends Position {
  constructor(public origin:Position, public searchDir: Position) {
    super(origin.x, origin.y)
  };
}

function searchGrid(x: number , y: number): SearchPosition[] {
  const posList: SearchPosition[] = [];
  for(let dx = -1; dx < 2; dx++) { 
    for(let dy = -1; dy < 2; dy++) { 
      if (!(dx === 0 && dy === 0)) {
        posList.push(new SearchPosition(new Position(x,y), new Position(dx,dy)));
      }
    }
  }

  return posList;
}

function checkLetter(pos: SearchPosition, depth: number, letter: string) {
  const x = pos.origin.x + (pos.searchDir.x * depth);
  const y = pos.origin.y + (pos.searchDir.y * depth);

  if (x < 0 || y < 0 || x >= gInputs[0].length || y >= gInputs.length) return false;
  return gInputs[y][x] === letter;
}

function checkX(x: number, y: number): boolean {

  if (x < 1 || y < 1 || x >= gInputs[0].length - 1 || y >= gInputs.length-1) return false;

  const l1 = gInputs[y - 1][x - 1];
  const l2 = gInputs[y + 1][x + 1];
  var a = [l1, l2].sort().join('');

  const l3 = gInputs[y - 1][x + 1];
  const l4 = gInputs[y + 1][x - 1];
  var b = [l3, l4].sort().join('');

  return a === 'MS' && b === 'MS';
}

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  reset();
  gInputs = inputs;

  let answer: number | string = 0;

  //console.log(inputs);
  //console.log(additionalInfo);
  
  const word = 'XMAS'
  let search: SearchPosition[] = [];
  for( var y = 0; y < inputs.length; y++) {
    let i = inputs[y];
    for( var x = 0; x < i.length; x++) {
      if (i[x] === 'X' && part === 1) {
        search.push(... searchGrid(x,y));
      } else if(i[x] === 'A' && part === 2) {
        answer += (checkX(x,y) ? 1 : 0);
      }
    }
  }
  if (part === 1) {
    for (let i = 1; i < word.length; i++) {
      search = search.filter(v => checkLetter(v, i, word[i]));
    }
  } else {
    return answer;
  }
  //throw new Error("Not implemented"); // <-- Replace with your solution
  return search.length;
}

run(__filename, solve);

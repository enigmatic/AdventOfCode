import { expect } from 'earl';
import { run } from "aoc-copilot";

const debug = true;
function log(text: string): void {
  if (debug) {
    console.log(text);
  }
}

//Globals

function reset() {
  //Reset Globals here
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

  let histA = new Array<number>();
  let histB = new Array<number>();
  let mapB = new Map<number, number>();
  inputs.forEach(v => {
    let values = v.split(/\s+/).map(v => parseInt(v));
    histA.push(values[0]);
    histB.push(values[1]);
    mapB.set(values[1], (mapB.get(values[1]) || 0) + 1);
  });

  if (part === 1) {
    histA.sort();
    histB.sort();
    answer = histA.reduce((a, v, i)=> a + Math.abs(v - histB[i]),0);
  } else {
    answer = histA.reduce((a, v)=> a + v * (mapB.get(v) || 0) ,0);
  }
  
  //throw new Error("Not implemented"); // <-- Replace with your solution
  return answer;
}

run(__filename, solve);

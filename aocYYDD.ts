import chai from "chai";
import { run } from 'aoc-copilot';

const debug = true;
function log(text:string): void {
    if (debug) {
        console.log(text);
    }
}

async function solve(
    inputs: string[], // Contents of the example or actual inputs
    part: number,     // Indicates whether the solver is being called for part 1 or 2 of the puzzle
    test: boolean,    // Indicates whether the solver is being run for an example or actual input
    additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
    let answer: number | string = 0;

    console.log(inputs);
    console.log(additionalInfo);
    throw new Error('Not implemented'); // <-- Replace with your solution
    return answer;
}

run(__filename, solve);

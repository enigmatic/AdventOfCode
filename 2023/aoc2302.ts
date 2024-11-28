import chai from "chai";
import { run } from "aoc-copilot";

const maxVals = new Map();
maxVals.set("red", 12);
maxVals.set("green", 13);
maxVals.set("blue", 14);

function isValidGame(game: string): Boolean {
  let games = game.split(";");
  return !games.some((cubes: string) => {
    return cubes.split(",").some((testMe: string) => {
      let c = parseInt(testMe);
      var color = testMe.trim().split(" ")[1];
      return maxVals.get(color) < c;
    });
  });
}

function gamePower(game: string): number {
  let games = game.split(";");
  let minCubes = new Map<string, number>()
  minCubes.set('red',0);
  minCubes.set('blue',0);
  minCubes.set('green',0);

  games.forEach((cubes: string) => {
    cubes.split(",").forEach((testMe: string) => {
      let c = parseInt(testMe);
      var color = testMe.trim().split(" ")[1];
      if (minCubes.get(color) < c){
        minCubes.set(color,c);
      };
    });
  });

  let acc = 1;
  for( let value of minCubes.values()) {
    acc *= value;
  }
  return acc;
}

chai.expect(isValidGame("3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green")).to.be
  .true;
chai.expect(isValidGame("13 blue, 14 red; 1 red, 2 green, 6 blue; 2 green")).to
  .be.false;

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  let answer: number | string = 0;
  if (part === 1) {
    answer = inputs.reduce((result, line) => {
      let vals = line.split(":");
      if (isValidGame(vals[1])) {
        let value = parseInt(vals[0].trim().split(" ")[1]);
        return result + value;
      }
      return result;
    }, answer);
  } else {
    answer = inputs.reduce((result, line) => {
        let vals = line.split(":");
        result += gamePower(vals[1]) 
        return result;
    }, answer);
  }

  return answer;
}

run(__filename, solve);

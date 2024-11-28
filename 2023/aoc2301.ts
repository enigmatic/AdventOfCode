import chai from "chai";
import { run } from "aoc-copilot";

function replaceFirstNumber(input: string): string {
  let integerList: Array<string> = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let numberFound = -1;
  let numberLoc = input.length;

  for (let i = 1; i < 10; i++) {
    let index = input.indexOf(integerList[i]);
    if (index > -1 && index < numberLoc) {
      numberFound = i;
      numberLoc = index;
    }
  }

  if (numberFound !== -1) {
    return (
      input.substring(0, numberLoc) +
      numberFound.toString() +
      input.substring(numberLoc + integerList[numberFound].length)
    );
  } else {
    return input;
  }
}

chai.expect(replaceFirstNumber("twone")).to.eq("2ne");

function replaceLastNumber(input: string): string {
  let integerList: Array<string> = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];

  let numberFound = -1;
  let numberLoc = 0;

  for (let i = 1; i < 10; i++) {
    let index = input.lastIndexOf(integerList[i]);
    if (index > numberLoc) {
      numberFound = i;
      numberLoc = index;
    }
  }

  if (numberFound !== -1) {
    return (
      input.substring(0, numberLoc) +
      numberFound.toString() +
      input.substring(numberLoc + integerList[numberFound].length)
    );
  } else {
    return input;
  }
}

chai.expect(replaceLastNumber("twone")).to.eq("tw1");

async function solve(
  inputs: string[], // Contents of the example or actual inputs
  part: number, // Indicates whether the solver is being called for part 1 or 2 of the puzzle
  test: boolean, // Indicates whether the solver is being run for an example or actual input
  additionalInfo?: { [key: string]: string } // Additional info for some puzzles with multiple examples
): Promise<number | string> {
  let answer: number | string = 0;

  if (part === 2) {
    inputs = inputs.map((value: string) => {
      return replaceFirstNumber(value) + replaceLastNumber(value);
    });
  }

  answer = inputs.reduce((value: number, text: String) => {
    let first: string;
    let last: string;

    let nums = text.split("").filter((v) => !isNaN(Number(v)));
    first = nums[0];
    last = nums[nums.length - 1];

    return value + parseInt(first + last);
  }, 0);

  return answer;
}

run(__filename, solve);

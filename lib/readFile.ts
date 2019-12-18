import * as fs from 'fs';

export default function(fileName: string): string[] {
  const input: string = fs.readFileSync(fileName, 'utf8');
  let inputArray: string[] = input.split('\r\n');
  if (inputArray.length === 1) {
    inputArray = input.split('\n');
  }

  return inputArray;
}

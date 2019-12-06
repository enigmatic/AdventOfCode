import * as fs from 'fs';

export default function(fileName: string): string[] {
  const input:string = fs.readFileSync(fileName, 'utf8');
  const inputArray: string[] = input.split('\r\n');

  return inputArray;
}
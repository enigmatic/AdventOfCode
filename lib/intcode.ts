export default function(prog: string): string[] {
  let code = prog.split(',').map(v => Number(v));
  let p = 0;
  while (code[p] === 1 || code[p] === 2) {
    if (code[p] === 1) {
      code[code[p + 3]] = code[code[p + 1]] + code[code[p + 2]];
      p += 4;
    } else if (code[p] === 2) {
      code[code[p + 3]] = code[code[p + 1]] * code[code[p + 2]];
      p += 4;
    }
  }

  if (code[p] !== 99)
    console.error(`IntCode Error: ${code[p]} OpCode not recognized!`);
  return code.map(v => v.toString());
}

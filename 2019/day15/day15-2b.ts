import readFile from '../../lib/readFile';

const strData: string[] = readFile(__dirname + '\\output.txt');
let o2map = strData.map(line => line.split(''));

function drawMap(draw: string[][]) {
  const lines = draw.map(l => l.join(''));
  lines.forEach(l => console.log(l));
}

drawMap(o2map);

function o2Here(x: number, y: number): boolean {
  if (x < 0 || x >= o2map[0].length) {
    return false;
  }
  if (y < 0 || y >= o2map.length) {
    return false;
  }
  return o2map[y][x] === '+';
}

function willFill(x: number, y: number): boolean {
  return (
    o2Here(x, y - 1) || o2Here(x - 1, y) || o2Here(x + 1, y) || o2Here(x, y + 1)
  );
}

let emptySpace = true;
let ticks = 0;
while (emptySpace) {
  ticks++;
  emptySpace = false;
  o2map = o2map.map((line, y) =>
    line.map((c, x) => {
      if (c === '#') {
        return '#';
      } else if (c === '+') {
        return '+';
      } else if (willFill(x, y)) {
        return '+';
      } else {
        emptySpace = true;
        return c;
      }
    })
  ) as Array<string[]>;

  console.clear();
  drawMap(o2map);
}

console.log(ticks);

console.time('day17');
import readFile from '../lib/readFile';
import chalk from 'chalk';

let debug = false;
var data:string[] = readFile(__dirname + '\\input.txt');

class Point {
  x:number;
  y:number;
  constructor(x:number,y:number){
    this.x = x;
    this.y = y;
  }
}

class PointRange {
  x:string;
  y:string;
  constructor(x:string, y:string) {
    this.x = x;
    this.y = y;
  };
  public toArray():Point[] {
    let pList:Array<Point> = [];
    if (this.y.includes('..')) {
      let x = parseInt(this.x);
      let yPair = this.y.split('..').map<number>(v=>parseInt(v));
      for (let y = yPair[0]; y < yPair[1]+1; y++)
        pList.push(new Point(x,y));
    } else {
      let y = parseInt(this.y);
      let xPair = this.x.split('..').map<number>(v=>parseInt(v));
      for (let x = xPair[0]; x < xPair[1]+1; x++)
        pList.push(new Point(x,y));
    }
    return pList;
  }
}

let rangeList:PointRange[] = [];

data.forEach(line => {
  let xStr:string = '';
  let yStr:string = '';
  line.split(', ').forEach(v=>{
    if (v[0] === 'x') {
      xStr = v.substr(2);
    } else {
      yStr = v.substr(2);
    }
  });

  let pr = new PointRange(xStr, yStr);
  rangeList.push(pr);
});

let pointList = rangeList.reduce<Point[]>((acc, v)=>acc.concat(v.toArray()),[]);

let xMin:number = 500;
let xMax:number = 500;
let yMin:number = pointList[0].y;
let yMax:number = pointList[0].y;
pointList.forEach(p => {
  if (xMin > p.x) xMin = p.x;
  if (xMax < p.x) xMax = p.x;
  if (yMin > p.y) yMin = p.y;
  if (yMax < p.y) yMax = p.y;
});
xMin--;

let ground:Array<Array<string>> = Array(yMax - yMin + 2)
                                  .fill(0).map<string[]>(v =>{
                                    return Array(xMax - xMin + 1).fill('.');
                                  });
pointList.forEach(p => ground[p.y-yMin][p.x-xMin] = '#');

function draw() {
  
  ground.forEach((layer, idx) => {
    if (idx === ground.length-1) return;
    let draw = "";
    layer.forEach((block, id) => {
      if (block === '#') {
        draw += '#'//chalk.green('#');
      } else if (block === '|') {
        draw += '|';//chalk.bold.blueBright('|')
      } else if (block === '~') {
        draw += '~';//chalk.bold.blueBright('~')
      } else {
        draw += ' ';//block;
      }
    })

    //draw += (yMin + idx).toString();
    if (debug) console.log(draw);
  })
}

//draw();

let waterFalls:Array<Point> = [new Point(500-xMin,0)];
let iter = 0;
while (waterFalls.length > 0) {
  iter++;
  let nextWaterFalls:Array<Point> = [];

  waterFalls.forEach(fall => {
    switch (ground[fall.y+1][fall.x]) {
      case '.':
        ground[fall.y][fall.x] = '|';
        let nextY = fall.y+1
        while(ground[nextY+1][fall.x] === '.') {
          ground[nextY][fall.x] = '|';
          nextY++;
          if (!(nextY < ground.length-1)) break;
        }
        nextWaterFalls.push(new Point(fall.x, nextY));
        break;
      case '#':
      case '~':
        let contained = true;
        let startX = fall.x;
        while(startX > 0) {
          startX--;
          if (ground[fall.y][startX] === '#') break;
          if (ground[fall.y+1][startX] === '.' || ground[fall.y+1][startX] === '|') {
            contained = false;
            ground[fall.y][startX] = '|';
            nextWaterFalls.push(new Point(startX, fall.y+1));
            break;
          }
        } 
        let endX = fall.x;
        while(endX < ground[0].length) {
          endX++;
          if (ground[fall.y][endX] === '#') break;
          if (ground[fall.y+1][endX] === '.' || ground[fall.y+1][endX] === '|') {
            ground[fall.y][endX] = '|';
            contained = false;
            nextWaterFalls.push(new Point(endX, fall.y+1));
            break;
          }
        }
        for (let x = startX+1; x < endX; x++) {
          ground[fall.y][x] = contained ? '~' : '|';
        }
        if (contained) {
          nextWaterFalls.push(new Point(fall.x, fall.y-1));
        }
        break;
      case '|':
        ground[fall.y][fall.x] = '|';
      default:
        break;
    }
  });

  waterFalls = nextWaterFalls.filter(p=>p.y<ground.length-1);
  /*
  //draw();
  
  let drawXMin=ground.length;
  let drawXMax=0;
  let drawYMin=ground[0].length;
  let drawYMax=0;

  console.clear();

  waterFalls.forEach(p => {
    if (p.x < drawXMin) drawXMin = p.x;
    if (p.x > drawXMax) drawXMax = p.x;
    if (p.y < drawYMin) drawYMin = p.y;
    if (p.y > drawYMax) drawYMax = p.y;
  })

  if (drawYMin < 5) drawYMin = 5;
  if (drawYMax > ground.length - 5) drawYMax = ground.length - 5;
  if (drawXMin < 0) drawXMin = 0;
  if (drawXMax > ground[0].length - 5) drawXMax = ground[0].length -5;

  console.log(iter, waterFalls.length, drawYMin, drawYMax);
  for(let y = drawYMin-5; y < drawYMax+5; y++) {
      let draw = "";
      for (let x = drawXMin-5; x < drawXMax + 5; x++) {
        let block = ground[y][x];
        if (block === '#') {
          draw += chalk.green('#');
        } else if (block === '|') {
          draw += chalk.bold.blueBright('|')
        } else if (block === '~') {
          draw += chalk.bold.blueBright('~')
        } else {
          draw += block;
        }
      }
      draw += (yMin + y).toString();
      console.log(draw);
  }
  //*/


}

draw();
let counter = ground.reduce<number>((c, v, idx)=>{
  if (idx === ground.length-1) return c;
  return c+v.reduce((c,v)=>( v === '|' || v === '~') ? c+1 : c, 0)}
  , 0);
console.log('Water Reach (part 1): ' + counter);


counter = ground.reduce<number>((c, v, idx)=>{
  if (idx === ground.length-1) return c;
  return c+v.reduce((c,v)=>( v === '~') ? c+1 : c, 0)}
  , 0);
console.log('Remaining (part 2): ' + counter);

console.timeEnd('day17');
console.time('day10');
import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\input.txt');
var debug = false;

class Point {
  public x = 0;
  public y = 0;
  public xd = 0;
  public yd = 0;
}

let pointList: Point[] = [];

data.forEach(line => {
  let p = new Point();

  
  let locationPos = line.search(/position=</) + 10;
  let velocityPos = line.search(/> velocity=</) +12;
  let locations = line.substr(locationPos, velocityPos - locationPos -12).split(',');
  let velocities = line.substr(velocityPos, line.length - velocityPos - 1).split(',');

  p.x = parseInt(locations[0]);
  p.y = parseInt(locations[1]);
  p.xd = parseInt(velocities[0]);
  p.yd = parseInt(velocities[1]);

  pointList.push(p);

  if (debug) console.log(line, p);
})

let pointArea = 0;

const movePoints = () => {
  let minX = 100000000, maxX = -10000000;
  let minY = 100000000, maxY = -10000000;

  pointList.forEach(p => {
    p.x += p.xd;
    p.y += p.yd;

    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  pointArea = (maxX - minX) * (maxY - minY);
}

let pointPlot:string[][]= [];

const rewindAndPlotPoints = () => {
  let minX = 100000000, maxX = -10000000;
  let minY = 100000000, maxY = -10000000;

  pointList.forEach(p => {
    p.x -= p.xd;
    p.y -= p.yd;

    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  });

  pointArea = (maxX - minX) * (maxY - minY);

  if (debug) console.log(maxX-minX, 'x', maxY-minY );

  pointPlot = new Array(maxY-minY+1);
  for (let a = 0; a < pointPlot.length; a++){
    pointPlot[a] = new Array(maxX-minX+1).fill('.');
  }

  pointList.forEach(p => {

    let x = p.x-minX;
    let y = p.y-minY;
    
    //console.log('[', p.x, p.y, '] => [', x, y,']');
    pointPlot[y][x]='#'
  })
}

const printPlot = (plot:string[][]) => {
  for(let l = 0; l < pointPlot.length; l++)
  {
    console.log(pointPlot[l].join(''));
  }
}

let lastArea = 11336392704000;
pointArea = lastArea - 1;

let time = 0;
while ( lastArea > pointArea) {
  lastArea = pointArea;
  movePoints();
  //console.log(pointArea);
  time++;
}

rewindAndPlotPoints();
printPlot(pointPlot);
console.log(time)
console.timeEnd('day10');
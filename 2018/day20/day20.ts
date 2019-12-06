console.time('day20');
import readFile from '../lib/readFile';

let debug = false;
var data:string[] = readFile(__dirname + '\\input.txt');

  
class Point {
  private _x:number;
  public set x(v : number) {
    this._x = v;
  }
  public get x() : number {
    return this._x
  }
  
  private _y:number;
  public set y(v : number) {
    this._y = v;
  }
  public get y() : number {
    return this._y
  }

  distance: number;
  public get str():string {
    return this._x.toString() + ',' + this._y.toString();
  };

  constructor(x:number, y:number, distance:number = 0) {
    this._x = x;
    this._y = y;
    this.distance = distance
  }

  getNeighbors = (doors:Set<string>):Point[] =>{
    let pList:Point[] = [];
    let offsets =[[0,-1],
            [-1,0],     [1,0],
                  [0,1]]
             
    offsets.forEach(c=>{
          let doorStr = (this.x + c[0]).toString() + ',' + (this.y + c[1]).toString()
          if (doors.has(doorStr)) {
            pList.push(new Point(this.x+(2*c[0]),this.y+(2*c[1]),this.distance+1));
          }
        })

    return pList;
  }
}

// even, even is always a room
// odd, odd is always a wall
// even,odd & odd,even is a wall unless it's in the door list as 'x,y'
function buildRooms(path:string, print:boolean):Set<string> {
  var doors:Set<string> = new Set();  

  //start@500,500
  let minX = 500;
  let minY = 500;
  let maxY = 500;
  let maxX = 500;

  function printLayout() {
    for (let y = minY-1; y < maxY + 2; y++) {
      let line = '#'
      for(let x = minX; x < maxX+1; x++) {
        if(x % 2 === 0 && y % 2 === 0) {
          if (x===500 && y ===500) line += 'X';
          else line += ' ';
        } else if (x % 2 === 1 && y % 2 === 1){
          line += '#';
        } else {
          if (doors.has(x.toString() +','+y.toString())) {
            if (x % 2 === 1)
              line += '|';
            else 
              line += '-';
          } else {
            line += '#';
          }
        }
      }
      line += '#'
      console.log(line);
    }
  }
  
  
  function walkPath( walkers:Point[], path:string) {
    if (print) console.log(walkers.length, 'walking:', path);

    let forkPos = path.indexOf('(');
    if (forkPos === -1)
      forkPos = path.length;

    let firstWalk = path.substring(0,forkPos);
    for (let step = 0; step < firstWalk.length; step++)
    {
      walkers.forEach(w=>{
        switch (firstWalk[step]) {
          case 'N':
            w.y--;
            doors.add(w.str);
            w.y--;
            break;
          case 'S':
            w.y++;
            doors.add(w.str);
            w.y++;
            break;
          case 'E':
            w.x++;
            doors.add(w.str);
            w.x++;
            break;
          case 'W':
            w.x--;
            doors.add(w.str);
            w.x--;
            break;
          default:
            break;
        }

        if (w.x < minX) minX = w.x;
        if (w.x > maxX) maxX = w.x;
        if (w.y < minY) minY = w.y;
        if (w.y > maxY) maxY = w.y;
      })
    }
    
    let remPath = path.substring(forkPos);

    if (path.length > forkPos) {
      let remString = path.substring(forkPos);
      let forkDepth = 1;
      let forkEnd = 0;
      let splits:Array<number> = [0];
      do {
        forkEnd++;
        
        if (remString[forkEnd] === '(') forkDepth++;
        if (remString[forkEnd] === ')') forkDepth--;
        if (remString[forkEnd] === '|' && forkDepth === 1) splits.push(forkEnd);
      } while (forkDepth > 0 && forkEnd < remString.length)
      splits.push(forkEnd);
      
      let forks = remString.substring(1, forkEnd);
      remPath = remString.substring(forkEnd+1);
      let forkWalkers:Point[] = [];
      splits.forEach((location, idx) => {
        if (location !== forkEnd) {
          let newWalkers = walkers.map(p => new Point(p.x,p.y));
          walkPath(newWalkers, forks.substring(location, splits[idx+1]-1));
          forkWalkers = [...forkWalkers, ...newWalkers];
        }
      });

      let trimFat:Set<string> = new Set();
      walkers = forkWalkers.filter(w => {
        if (trimFat.has(w.str)) return false;
        trimFat.add(w.str);
        return true;
      });
      if (print) console.log('trimmed', forkWalkers.length, 'walkers to ', walkers.length);
    }
    if (remPath.length > 0)
      walkPath(walkers, remPath);
  }

  let realPath = path.substring(path.indexOf('^')+1, path.indexOf('$'));
  walkPath([new Point(500,500)], realPath);

  if (print) printLayout()
  return doors;
}
let farRooms = 0;
function findFurthest(doors:Set<string>):number {

  //Potential Destinations
  let visited:Set<string> = new Set();
  let points:Array<Point> = [new Point(500, 500, 0)];
  visited.add('500,500');
  let maxLen = 0;
  while (points.length > 0) {
    let nextPoints:Array<Point> = [];

    points.forEach(point => {

      point.getNeighbors(doors).forEach(p => {

        if (!visited.has(p.str)) {
          nextPoints.push(p)
          if (p.distance >= 1000) farRooms++;
          if (p.distance > maxLen) maxLen = p.distance;
          visited.add(p.str);
        }
      });
    });

    points = nextPoints;
  }

  return maxLen;
}

console.log('^WNE$: ', findFurthest(buildRooms('^ENW$', false)));
console.log('^ENWWW(NEEE|SSE(EE|N))$: ', findFurthest(buildRooms('^ENWWW(NEEE|SSE(EE|N))$', false)));
console.log('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$: ', findFurthest(buildRooms('^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$', false)));
console.log('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$: ', findFurthest(buildRooms('^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$', false)));
console.log('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$: ', findFurthest(buildRooms('^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$', false)));
//*
console.log('part 1 Start');
let doorList = buildRooms(data[0], false)
console.log('Doors Located');
let dist = findFurthest(doorList)
console.log('part 1:', dist);
console.log('part 2:', farRooms);
//*/
console.timeEnd('day20')
console.time('day22')

enum Tool {
  neither,
  climbing,
  torch
}

let target={x:9,y:739, tool:Tool.torch}; //{x:9,y:739};
let depth = 10914;
let buffer = 40;

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

  _geologic: number;
  public get str():string {
    return this._x.toString() + ',' + this._y.toString();
  };

  public get erosionLevel():number {
    return (this._geologic + depth) % 20183;
  }

  public get type():number {
    return this.erosionLevel % 3;
  }

  constructor(x:number, y:number, _geologic:number = 0) {
    this._x = x;
    this._y = y;
    if (x === target.x && y === target.y)
      this._geologic = 0
    else 
      this._geologic = _geologic
  }

}

let pointList:Array<Point[]> = [];
let risk = 0;
for (let y=0; y < target.y+buffer; y++) {
  pointList.push([]);
  for (let x=0; x < target.x+buffer; x++) {
    if ( y === 0 ) {
      pointList[0].push(new Point(x, y, x*16807));
    } else if ( x === 0 ) {
      pointList[y].push(new Point(x, y, y*48271));
    } else {
      let gi = pointList[y-1][x].erosionLevel * pointList[y][x-1].erosionLevel;
      pointList[y].push(new Point(x, y, gi));
    }
    if (y <= target.y && x <= target.x)
      risk += pointList[y][x].type;
    
  }
}

console.log('part 1:',risk);

class PathPoint extends Point{
  private _tool:Tool;
  public get tool():Tool {
    return this._tool;
  }

  private _distance:number;
  public get distance():number{
    return this._distance;
  }

  public get str():string {
    return super.str + ',' + this.tool;
  }

  public path:string[] = [];
  public get type():number {
    return pointList[this.y][this.x].type;
  }

  constructor(x:number, y:number, distance:number, tool:Tool) {
    super(x,y);
    this._tool = tool;
    this._distance = distance;
  }

  getNeighbors(visited:Set<string>):PathPoint[] {
    let pList:PathPoint[] = [];
    let offsets =[[0,-1],
            [-1,0],     [1,0],
                  [0,1]];
    offsets.forEach(o => {
      if (this.y + o[1] < 0 || this.x + o[0] < 0) return ;
      if (this.y + o[1] > target.y + buffer - 1 || this.x + o[0] > target.x + buffer - 1) return ;

      let p = pointList[this.y + o[1]][this.x + o[0]];
      if (p) {
        if (this.tool === Tool.neither  && p.type === 0) return; //Need a tool for rocky
        if (this.tool === Tool.torch    && p.type === 1) return; //Can't use torch when wet
        if (this.tool === Tool.climbing && p.type === 2) return; //Can't use climbing when narrow
        if (!visited.has(p.str + ',' + this.tool)) {
          let myP = new PathPoint(this.x + o[0], this.y + o[1], this.distance+1, this.tool );
           myP.path = [...this.path,...[myP.distance + ': Move to ' + myP.str + ' type ' + myP.type]];
          pList.push(myP);
        }
      }
    });

    let  otherTool:Tool = Tool.neither;
    if (this.type === 0 ) (this._tool === Tool.torch) ? otherTool = Tool.climbing : otherTool = Tool.torch;
    if (this.type === 1 ) (this._tool === Tool.neither) ? otherTool = Tool.climbing : otherTool = Tool.neither;
    if (this.type === 2 ) (this._tool === Tool.torch) ? otherTool = Tool.neither : otherTool = Tool.torch;
        
    if (!visited.has(super.str + ',' + otherTool)) {
      let myP = new PathPoint(this.x, this.y, this.distance+7, otherTool)
      myP.path = [...this.path,...[myP.distance + ': Swap tool ' + Tool[this.tool] + ' to ' + Tool[myP.tool]]];
      pList.push(myP);
    }

    return pList;
  }
}

function findFurthest():number {

  //Potential Destinations
  let visited:Set<string> = new Set();
  let points:Array<PathPoint> = [new PathPoint(0,0,0, Tool.torch)];
  points[0].path = ['0 :Start at ' + points[0].str];

  let iter = 0;
  let dist = -1
  while (points.length > 0){//} && iter < 10) {
    iter++;
    let point = points.pop() as PathPoint;
    //console.log('trying,', point);
    if (point.x === target.x && point.y === target.y && point.tool === target.tool){
      //console.log(point.path);
      return point.distance;
    }

    //console.log(point.getNeighbors(visited));
    visited.add(point.str);
    points = points.filter((p => p.str !== point.str));
    point.getNeighbors(visited).forEach(p => {
      if (!visited.has(p.str)) {
        points.push(p);
      }
    });

    points.sort((a,b) => b.distance - a.distance);
  }

  return -1;
}

console.log('part 2:', findFurthest())

console.timeEnd('day22');
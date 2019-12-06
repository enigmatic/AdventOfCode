import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\day7.input');
var debug = false;

class Step {
  step:string = '';
  before:string[] = [];
}

var steps:any = {};
var requiredList:any = {};
var candidates: string[] = []

data.forEach( line => {
  let stepPos = line.search(/Step [A-Z]/);
  let step = line.substr(stepPos+5,1);

  let reqPos = line.search(/step [A-Z]/);
  let req = line.substr(reqPos+5,1);

  if (!(step in steps)){
    let s:Step = {
      step : step,
      before: []
    }
    steps[step] = s;
  }

  steps[step].before.push(req);

  if (!(req in requiredList)) {
    requiredList[req] = []
  }
  requiredList[req].push(step);

  let checkCandidate = candidates.indexOf(req);
  if (checkCandidate != -1) {
    candidates.splice(checkCandidate,1);
  }

  if (!(step in requiredList) && candidates.indexOf(step) == -1) {
    candidates.push(step);
  }

})

if (debug) console.log(steps);
if (debug) console.log(requiredList);
if (debug) console.log(candidates);

let stepList = '';

while (candidates.length > 0) {
  candidates.sort();
  var nextStep:string = candidates.shift() as string;

  stepList += nextStep;
  if (debug) console.log(nextStep);
  if (nextStep in steps) {

    let preReqList: Array<string> = steps[nextStep].before;
    if (debug) console.log(nextStep, preReqList);

    preReqList.forEach(step => {
      let i = requiredList[step].indexOf(nextStep);
      if (i === -1) {
        console.log('error!!!!');
      }
      requiredList[step].splice(i,1);
      if (requiredList[step].length === 0) {
        candidates.push(step);
      }
    });
    
  }

  if (debug) console.log(candidates);
}

console.log(stepList);
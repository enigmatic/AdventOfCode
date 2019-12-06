console.time('day24')

import readFile from '../lib/readFile';

var data:string[] = readFile(__dirname + '\\input.txt');
var debug = true;

class Group {
  type:string = 'immune'
  id:number = -1;
  units:number = 0;
  health:number = 0;
  weakness:Set<string> = new Set();
  immunity:Set<string> = new Set();
  attackType:string = 'basic';
  damage:number = 0;
  initiative:number = 0;
  target: Group | null = null

  public get effectivePower():number {
    if (this.units <= 0) return 0;
    return this.units * this.damage;
  }

  checkDamage = (amount:number, type:string):number => {
    if (this.immunity.has(type)) return 0;
    if (this.weakness.has(type)) return 2 * amount;
    return amount;
  }

  takeDamage = (amount:number, type:string) => {
    if (this.immunity.has(type)) return;
    let dmg = amount;
    if (this.weakness.has(type)) dmg = 2 * amount;
    var killed = Math.floor(dmg / this.health);
    this.units -= killed;
    if (this.units < 0) this.units = 0;
  }
}

let groups:Group[] = [];

let infection = false;
let id = 0;
data.forEach(line =>{
  if (line.indexOf('Immune System:') > -1 || line.length === 0) return;
  if (line.indexOf('Infection:') > -1) {
    id = 0;
    infection = true;
    return;
  }
  
  id++;

  let g = new Group();
  g.units = parseInt(line.substring(0, line.indexOf('units')));
  g.health = parseInt(line.substring(line.indexOf('each with')+10, line.indexOf('hit points')));
  if (line.includes('(')) {
    let detail = line.substring(line.indexOf('('), line.indexOf(')')+1);
    if (detail.includes('immune')) {
      let endImmune = 0;
      if (detail.includes(';'))
        endImmune = detail.indexOf(';');
      else
        endImmune = detail.indexOf(')');

      detail.substring(detail.indexOf('immune') +10, endImmune).split(',').forEach(i => g.immunity.add(i.trim()));
    }
    
    if (detail.includes('weak')) {
      let weakStr= detail.substring(detail.indexOf('weak to') + 8, detail.indexOf(')'));
      weakStr.split(',').forEach(i => g.weakness.add(i.trim()));
    }
  }
  let attackStr = line.substring(line.indexOf('that does') + 10).split(' ');
  g.damage = parseInt(attackStr[0]);
  g.attackType = attackStr[1];
  g.initiative = parseInt(attackStr[attackStr.length-1]);


  g.type =  (infection)? 'infection':'immune'
  g.id = id;
  groups.push(g);
});

//if (debug) console.log(groups);

function statusPrint() {
  if (!debug) return;
  groups.sort((a, b) => {
    if (a.type === b.type) return a.id - b.id;
    if (a.type == 'immune') return -1;
    return 1;
  })

  groups.forEach(g => console.log(g.type, 'group', g.id, 'contains', g.units, 'units', 'EP:', g.effectivePower));
}

function targetSelection() {
  groups.sort((a,b) => {
    if (b.effectivePower === a.effectivePower) return b.initiative - a.initiative;
    return b.effectivePower - a.effectivePower;
  })

  groups.forEach(g => {
    g.target = null;
  });

  let targets:Group[] = groups.map(g => g);
  groups.forEach(g => {
    let maxDamage = 0 ;
    let bestTarget:Group | null = null;
    targets.forEach(t => {
      if (t.type === g.type) return;

      let potentialDamage = t.checkDamage(g.effectivePower, g.attackType);
      if (potentialDamage === 0) return;
      if (potentialDamage > maxDamage || 
         (potentialDamage === maxDamage && 
            (bestTarget as Group).effectivePower < t.effectivePower) ||
         (potentialDamage === maxDamage && 
            (bestTarget as Group).effectivePower === t.effectivePower &&
            (bestTarget as Group).initiative <  t.initiative)) {
        maxDamage = potentialDamage;
        bestTarget = t;
        if (debug) console.log( g.type, 'group', g.id, 'would deal', t.type, 'group', t.id, potentialDamage, 'damage');
      }
    });
    if (bestTarget) {
      g.target = bestTarget;
      targets.splice(targets.indexOf(bestTarget), 1);
    }
  });

  //console.log(groups);
}

function attackPhase() {
  groups.sort((a,b) => {
    return b.initiative - a.initiative;
  });

  groups.forEach(g => {
    if (g.target !== null) {
      if (debug) {
        let deadUnits =Math.floor(g.target.checkDamage(g.effectivePower, g.attackType) / g.target.health);
        if (deadUnits > g.target.units) deadUnits = g.target.units;
        console.log( g.type, 'group', g.id, 'attacks', g.target.type, 'group', g.target.id, 'killing', deadUnits, 'units');
      }
      g.target.takeDamage(g.effectivePower, g.attackType);
    }
  })

}

let immuneCount = 0
let infectionCount = 0;
function checkCounts() {
  
  immuneCount = 0
  infectionCount = 0;
  groups.forEach(g => {
    if (g.type === 'immune') immuneCount++;
    if (g.type === 'infection') infectionCount++;
  })
}

checkCounts();
let iter = 0
while(immuneCount > 0 && infectionCount > 0){// && iter < 1) {
  iter++;
  statusPrint();
  targetSelection();
  attackPhase();
  groups = groups.filter(g => g.units > 0);
  checkCounts();
}

console.log('');
statusPrint();

let units = groups.reduce((acc, g) => acc+g.units, 0);
console.log('part 1: ', units);

console.timeEnd('day24');
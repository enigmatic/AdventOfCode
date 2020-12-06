import chai from "chai";
import { ReadFile } from "../../lib/AdventOfCode";

const strData: string[] = ReadFile(__dirname + "/input.txt");
const exData: string[] = ReadFile(__dirname + "/example.txt");
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

class Group {
  targeted = false;
  type = "immune";
  id = -1;
  units = 0;
  health = 0;
  weakness: Set<string> = new Set();
  immunity: Set<string> = new Set();
  attackType = "basic";
  damage = 0;
  initiative = 0;
  target: Group;

  public get effectivePower(): number {
    if (this.units <= 0) return 0;
    return this.units * this.damage;
  }

  checkDamage(amount: number, type: string): number {
    if (this.immunity.has(type)) return 0;
    if (this.weakness.has(type)) return 2 * amount;
    return amount;
  }

  takeDamage(amount: number, type: string) {
    let dmg = this.checkDamage(amount, type);
    var killed = Math.min(Math.floor(dmg / this.health), this.units);
    this.units -= killed;
  }
}

class System {
  groups: Group[] = [];
  constructor(data: string[]) {
    let infection = false;
    let id = 0;
    data.forEach((line) => {
      if (line.indexOf("Immune System:") > -1 || line.length === 0) return;
      if (line.indexOf("Infection:") > -1) {
        id = 0;
        infection = true;
        return;
      }

      id++;

      let g = new Group();
      g.units = parseInt(line.substring(0, line.indexOf("units")));
      g.health = parseInt(
        line.substring(
          line.indexOf("each with") + 10,
          line.indexOf("hit points")
        )
      );
      if (line.includes("(")) {
        let detail = line.substring(line.indexOf("("), line.indexOf(")"));
        let details = detail.split(';');
        details.forEach( d => {  
          if (d.includes("immune")) {
            const immuneString = d.substring(d.indexOf("immune") + 10);

            immuneString.split(",")
              .forEach((i) => g.immunity.add(i.trim()));
          }

          if (d.includes("weak")) {
            let weakStr = d.substring(
              d.indexOf("weak to") + 8
            );
            weakStr.split(",").forEach((i) => g.weakness.add(i.trim()));
          }
        })
      }
      let attackStr = line.substring(line.indexOf("that does") + 10).split(" ");
      g.damage = parseInt(attackStr[0]);
      g.attackType = attackStr[1];
      g.initiative = parseInt(attackStr[attackStr.length - 1]);

      g.type = infection ? "infection" : "immune";
      g.id = id;
      this.groups.push(g);
    });
  }

  loop = 0;
  statusLog() {
    if (debugging) console.log(`--${this.loop}--`);
    this.loop++;
    if (!debug) return;
    this.groups.sort((a, b) => {
      if (a.type === b.type) return a.id - b.id;
      if (a.type == "immune") return -1;
      return 1;
    });

    if (debugging)
      this.groups.forEach((g) =>
        console.log(
          g.type,
          "group",
          g.id,
          "contains",
          g.units,
          "units",
          "EP:",
          g.effectivePower
        )
      );
  }

  target() {
    this.groups.sort((a, b) =>
      a.effectivePower === b.effectivePower
        ? b.initiative - a.initiative
        : b.effectivePower - a.effectivePower
    );
    this.groups.forEach(g => g.targeted = false);
    for (const g of this.groups) {
      g.target = null;
      let tList = this.groups.filter(
        (t) => t.type !== g.type && !t.targeted && !t.immunity.has(g.attackType)
      );
      if (tList.length > 0) {
        tList.sort((a, b) => {
          let aD = a.checkDamage(g.effectivePower, g.attackType);
          let bD = b.checkDamage(g.effectivePower, g.attackType);
          if (aD === bD) {
            if (a.effectivePower === b.effectivePower) {
              return b.initiative - a.initiative;
            }
            return b.effectivePower - a.effectivePower;
          }
          return bD - aD;
        });
        const potentialTarget = tList[0];
        g.target = potentialTarget;
        potentialTarget.targeted = true;
        if (debugging)
          console.log(
            g.type,
            "group",
            g.id,
            "would deal",
            g.target.type,
            "group",
            g.target.id,
            g.target.checkDamage(g.effectivePower, g.attackType),
            "damage"
          );
      }
    }
  }

  attack() {
    this.groups.sort((a, b) => b.initiative - a.initiative);

    for (const g of this.groups) {
      if (g.units <= 0) continue;
      if (g.target) {
        if (debugging) {
          let deadUnits = Math.floor(
            g.target.checkDamage(g.effectivePower, g.attackType) /
              g.target.health
          );
          if (deadUnits > g.target.units) deadUnits = g.target.units;
          console.log(
            g.type,
            "group",
            g.id,
            "attacks",
            g.target.type,
            "group",
            g.target.id,
            "killing",
            deadUnits,
            "units"
          );
        }
        g.target.takeDamage(g.effectivePower, g.attackType);
      }
    }
  }

  cleanup() {
    this.groups = this.groups.filter((g) => g.units > 0);
  }

  end(): boolean {
    return !(
      this.groups.find((g) => g.type === "immune") &&
      this.groups.find((g) => g.type === "infection")
    );
  }

  get alive(): number {
    return this.groups.reduce((acc, g) => acc + g.units, 0);
  }

  boost(n:number) {
    this.groups.forEach(g => {if (g.type === "immune") g.damage+=n});
  }

  get winner(): string{
    return this.groups[0].type;
  }
}

function testBoost(data:string[]):number {
  let boost = 0;
  let winner = 'none'
  while (winner !== 'immune') {
    boost++;
    const s = new System(data);
    let stuck = 0;
    s.boost(boost)
    while (!s.end() && stuck !== s.alive) {
      stuck = s.alive;
      s.statusLog();
      s.target();
      s.attack();
      s.cleanup();
    }
    if (s.end()) {
      if (s.winner === 'immune'){
        return s.alive;
      }
      winner = s.winner;
    } else {
      winner = 'none'
    }
  }

  return -1;
}

function tests() {
  const s = new System(exData);
  while (!s.end()) {
    s.statusLog();
    s.target();
    s.attack();
    s.cleanup();
  }

  chai.expect(s.alive).to.equal(5216);

  chai.expect(testBoost(exData)).to.equal(51);
}

console.log("running tests");
tests();

console.log("running Data");
console.time("part1");

const s = new System(strData);
while (!s.end()) {
  s.statusLog();
  s.target();
  s.attack();
  s.cleanup();
}
console.log(s.alive);
console.timeEnd("part1");

console.log("part 2");
console.time("part2");

console.log(testBoost(strData));
console.timeEnd("part2");

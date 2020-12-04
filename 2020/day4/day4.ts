import chai from "chai";
import { isHeritageClause } from "typescript";
import { ReadFile } from "../../lib/AdventOfCode";

const strData: string[] = ReadFile(__dirname + "/input.txt");
const sampleData: string[] = ReadFile(__dirname + "/sample.txt");
const debugging = false;

function debug(str: string) {
  if (debugging) {
    console.log(str);
  }
}

class Passport {
  ecl: string;
  pid: string;
  eyr: string;
  hcl: string;
  byr: string;
  iyr: string;
  cid: string;
  hgt: string;
}

function parsePassports(input: string[]): Passport[] {
  const passList: Passport[] = [];

  let nextPass = new Passport();
  for (const line of input) {
    if (line.length === 0) {
      passList.push(nextPass);
      nextPass = new Passport();
    } else {
      line.split(" ").forEach((field) => {
        const members = field.split(":");
        switch (members[0]) {
          case "ecl":
            nextPass.ecl = members[1];
            break;
          case "pid":
            nextPass.pid = members[1];
            break;
          case "eyr":
            nextPass.eyr = members[1];
            break;
          case "hcl":
            nextPass.hcl = members[1];
            break;
          case "byr":
            nextPass.byr = members[1];
            break;
          case "iyr":
            nextPass.iyr = members[1];
            break;
          case "cid":
            nextPass.cid = members[1];
            break;
          case "hgt":
            nextPass.hgt = members[1];
            break;

          default:
            break;
        }
      });
    }
  }
  passList.push(nextPass);

  return passList;
}

function validatePassport(p:Passport) {
  return (p.byr &&
         p.ecl &&
         p.pid &&
         p.eyr &&
         p.iyr &&
         p.hgt &&
         p.hcl);
}

function validatePassportValues(p:Passport): boolean {
  if (p.byr &&
    p.ecl &&
    p.pid &&
    p.eyr &&
    p.iyr &&
    p.hgt &&
    p.hcl) {
      if (p.byr.length === 4 && parseInt(p.byr) >= 1920 && parseInt(p.byr) <= 2002 &&
      p.iyr.length === 4 && parseInt(p.iyr) >= 2010 && parseInt(p.iyr) <= 2020 &&
      p.eyr.length === 4 && parseInt(p.eyr) >= 2020 && parseInt(p.eyr) <= 2030 &&
      p.pid.length === 9) {
        const h = parseInt(p.hgt.substr(0, p.hgt.length - 2));
        let valid = false;
        if (p.hgt.endsWith('cm')) {
          valid = h >= 150 && h <= 193;
        } else if (p.hgt.endsWith('in')) {
          valid = h >= 59 && h <= 76;
        }
        if (valid) {
          valid = p.hcl.match(/#[0-9a-f]{6}/) !== null;
          if (valid) {
            return p.ecl === 'amb' || p.ecl === 'blu' || p.ecl === 'brn' || p.ecl === 'gry' || p.ecl === 'grn' || p.ecl === 'hzl' || p.ecl === 'oth';
          }

        }
      }
    }
  return false;
         
}

function tests() {
  const plist = parsePassports(sampleData);

  chai.expect(plist.reduce((acc, v) => validatePassport(v) ? acc + 1 : acc, 0)).to.equal(2);

  const invalidData: string[] = ReadFile(__dirname + "/invalid.txt");
  const iList = parsePassports(invalidData);
  chai.expect(validatePassportValues(iList[0])).to.be.false;
  chai.expect(validatePassportValues(iList[1])).to.be.false;
  chai.expect(validatePassportValues(iList[2])).to.be.false;
  chai.expect(validatePassportValues(iList[3])).to.be.false;
  
  const validData: string[] = ReadFile(__dirname + "/valid.txt");
  const vList = parsePassports(validData);
  chai.expect(validatePassportValues(vList[0])).to.be.true;
  chai.expect(validatePassportValues(vList[1])).to.be.true;
  chai.expect(validatePassportValues(vList[2])).to.be.true;
  chai.expect(validatePassportValues(vList[3])).to.be.true;
}

console.log("running tests");
tests();

console.log("running Data");
console.time("part1");

const plist = parsePassports(strData);
console.log(plist.reduce((acc, v) => validatePassport(v) ? acc + 1 : acc, 0))

console.timeEnd("part1");

console.log("part 2");
console.time("part2");
console.log(plist.reduce((acc, v) => validatePassport(v) && validatePassportValues(v) ? acc + 1 : acc, 0))
console.timeEnd("part2");

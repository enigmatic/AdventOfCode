const { exec } = require('child_process');
import chai from "chai";

let args:Array<any> = process.argv.slice(2);
chai.expect(args.length).to.eq(2);

let year = args[0];
let day = args[1];
if (day < 10) day = `0${day}`; 

exec(`npm run ts 20${args[0]}/aoc${year}${day}.ts`, (err:Error, stdout:string, stderr:string) => {

    console.log(stdout);

    if (err) console.error(err);
    if (stderr) console.error(stderr);
  });
const fs = require("fs");
import chai from "chai";

let args: Array<any> = process.argv.slice(2);
chai.expect(args.length).to.eq(2);

let year = args[0];
let day = args[1];
if (day < 10) day = `0${day}`; 

fs.copyFile("aocYYDD.ts", `20${args[0]}/aoc${year}${day}.ts`, (err: Error) => {
  if (err) {
    console.log("Error Found:", err);
  } else {
    // Get the current filenames
    // after the function
    console.log("\nFile created");
  }
});

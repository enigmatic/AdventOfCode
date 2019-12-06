let recipes:number[] = [3,7];
let elf1 = 0;
let elf2 = 1;

function iter() {
  let current:number = recipes[elf1] + recipes[elf2];
  let curStr = current.toString();
  
  let dSum = 0;
  for (let s = 0; s < curStr.length; s++) {
    recipes.push(parseInt(curStr[s]));
  }

  elf1 = (elf1 + 1 + recipes[elf1]) % recipes.length;
  elf2 = (elf2 + 1 + recipes[elf2]) % recipes.length;
}

function print() {
  let outStr = '';
  for (let i = 0; i < recipes.length; i++){
    if (i === elf1) {
      outStr += '(' + recipes[i] + ')';
    } else if (i === elf2) {
      outStr += '[' + recipes[i] + ']';
    } else {
      outStr += ' ' + recipes[i] + ' ';
    }
  }
  console.log(outStr);
}

let limit = 505961;
let loops = -1;
let idx = -1;
while(true) {
  //print();
  iter();
  loops +=1;
  if (recipes.length > 6) {
    idx = recipes.slice(recipes.length - 7).join('').indexOf('505961');
    if( idx > -1) {
      break;
    }
  }
}

console.log(loops);
console.log(recipes.length, recipes.length - 6, idx);

//console.log(recipes.slice(limit,limit + 10).join(''));


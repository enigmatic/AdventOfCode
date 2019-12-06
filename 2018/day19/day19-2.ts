let num = 10551331
let stop = num/2
let sum = 0;
for (let i = 1; i < stop; i++) {
  let mul = num/i;
  if (Math.floor(mul) === Math.ceil(mul)) {
    console.log(i, mul);
    sum +=i+mul;
    stop = mul;    
  }
}
console.log(sum);
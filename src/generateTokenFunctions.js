const { nanoid } = require("nanoid");

async function genTokensAccordingToDigits(numberOfTokens) {
  const digitsInNumberOfTokens = getNumOfDigits(numberOfTokens);

  const tokenSet = new Set();
  let duplications = 0;

  for (let i = 0; i < numberOfTokens; i++) {
    let token = nanoid(digitsInNumberOfTokens);
    !tokenSet.has(token) ? tokenSet.add(token) : duplications++;
  }
  console.log(`Duplications: ${duplications}`);
  return tokenSet;
}

function getNumOfDigits(number) {
  /* 
    Constraint: Bitwise is faster than lets say MATH.floor or MATH.trun
    but can handle number upto  2^31 
    */
  if (number === 0) {
    return 1;
  }

  let count = 0;
  while (number > 0) {
    number = ~~(number / 10);
    count++;
  }
  return count;
}
module.exports = genTokensAccordingToDigits;

const { nanoid } = require("nanoid");

async function generateTokens(numberOfTokens, lengthOfTokens) {
  if (numberOfTokens < 0 || lengthOfTokens < 0) {
    throw new Error("Invalid Values for NumOfTokens or LengthOfTokens");
  }

  const possibleCombos = 64 ** lengthOfTokens; // 64 is the default number of alphabets used by nanoid()
  lengthOfTokens = possibleCombos < numberOfTokens ? 6 : lengthOfTokens;

  const tokenSet = new Set();
  let duplications = 0;

  while (tokenSet.size < numberOfTokens) {
    let token = nanoid(lengthOfTokens);
    !tokenSet.has(token) ? tokenSet.add(token) : duplications++;
  }

  console.log(`Duplications: ${duplications}`);
  return tokenSet;
}

module.exports = generateTokens;

const { nanoid } = require("nanoid");
const TokenModel = require("./models");

async function generateTokens(numOfTokens, lenOfTokens) {
  if (numOfTokens < 0 || lenOfTokens < 0) {
    throw new Error("Invalid Values for NumOfTokens or LengthOfTokens");
  }
  const possibleCombos = 64 ** lenOfTokens; // 64 is the default number of alphabets used by nanoid()
  lenOfTokens = possibleCombos < numOfTokens ? 6 : lenOfTokens;

  const tokenSet = new Set();
  let duplications = 0;

  while (tokenSet.size < numberOfTokens) {
    let token = nanoid(lenOfTokens);
    !tokenSet.has(token) ? tokenSet.add(token) : duplications++;
  }
  console.log(`Duplications: ${duplications}`);
  return tokenSet;
}

async function saveTokenIntoDB() {}
function validateToken() {}

module.exports = { generateTokens, saveTokenIntoDB };

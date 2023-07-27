const { nanoid } = require("nanoid");
const TokenModel = require("./models");
require("dotenv").config();

async function generateTokens(numOfTokens, lenOfTokens) {
  if (numOfTokens < 0 || lenOfTokens < 0) {
    throw new Error("Invalid Values for NumOfTokens or LengthOfTokens");
  }
  const possibleCombos =
    64 **
    lenOfTokens; /* 64 is the default number of alphabets used by nanoid() */
  lenOfTokens = possibleCombos < numOfTokens ? 6 : lenOfTokens;

  const tokenSet = new Set();
  let duplications = 0;

  while (tokenSet.size < numOfTokens) {
    let token = nanoid(lenOfTokens);
    !tokenSet.has(token) ? tokenSet.add(token) : duplications++;
  }
  console.log(`Duplications: ${duplications}`);
  return tokenSet;
}

async function saveTokenIntoDB(
  clientNameParam,
  tokensArrayParam,
  validityDateParam,
  redeemedStatusParam = false
) {
  //   const entries = tokensArrayParam.map((tokenValue) => ({
  //     tokenValueParam,
  //     clientNameParam,
  //     validityDateParam,
  //     redeemedStatusParam,
  //   }));
  /* model.bulkCreate(array of objects, options) */
  let created = 0;
  try {
    //   await TokenModel.bulkCreate(entries, {
    //     updateOnDuplicate: ["tokenValue"],
    //   });
    for (let token of tokensArrayParam) {
      const [record, isCreated] = await TokenModel.findOrCreate({
        where: {
          tokenValue: token,
          clientName: clientNameParam,
          validityDate: validityDateParam,
          redeemedStatus: redeemedStatusParam,
        },
      });
      if (isCreated) {
        created++;
      }
    }
  } catch (error) {
    console.error("ERROR IN saveTokenIntoDB: ", error);
  } finally {
    console.log(`CREATED: ${created}`);
  }
}
async function redeemToken(tokenValueParam) {
  try {
    const dbResponse = await TokenModel.findByPk(tokenValueParam);
    if (dbResponse === null) {
      return process.env.TOKEN_DOES_NOT_EXIST;
    }

    return validateToken(dbResponse)
      ? "Redeemed"
      : "Token Expired or Already Redeemed";
  } catch (error) {
    console.error(`ERROR IN getTokenInfoFromDB: ${error}`);
    throw new Error(`ERROR IN getTokenInfoFromDB: ${error}`);
  }
}

function validateToken(tokenData) {
  return !tokenData.redeemedStatus && new Date() <= tokenData.validityDate;
}

async function displayDataFromTokenModel() {
  try {
    /* 
      findAll returns an array of objects where the objects are individual rows 
      along with some meta data  
      */
    const entries = await TokenModel.findAll();
    if (entries.length === 0) {
      console.log("NO DATA");
    }

    entries.forEach((row) => {
      console.log(row.dataValues);
    });
  } catch (error) {
    console.error("ERROR IN displayDataFromTokenModel: ", error);
  }
}

async function emptyTokenModel() {
  try {
    await TokenModel.destroy({ where: {} });
  } catch (error) {
    console.error("ERROR IN emptyTokenModel: ", error);
  }
}

module.exports = {
  generateTokens,
  saveTokenIntoDB,
  displayDataFromTokenModel,
  emptyTokenModel,
  redeemToken,
};

const { nanoid } = require("nanoid");
const TokenModel = require("./models");
const CONSTANTS = require("./constants");
require("dotenv").config();

TokenModel.beforeBulkCreate(async (records, options) => {
  try {
    const duplicatedRecords = await TokenModel.findAll({
      where: {
        tokenValue: records.map((token) => token.tokenValue),
      },
    });
    if (duplicatedRecords.length === 0) {
      return;
    }
    console.error(
      `TOKEN DUPLICATIONS IN DATABASE: ${duplicatedRecords.length}`
    );
    const tokensArray = await generateTokens(
      duplicatedRecords.length,
      duplicatedRecords[0].tokenValue.length
    );
    const { clientName, validityDate } = duplicatedRecords[0];
    await saveTokenIntoDBInBulk(clientName, tokensArray, validityDate);
  } catch (error) {
    console.error(`ERROR IN beforeBulkCreate: ${error}`);
  }
});

async function generateTokens(numOfTokens, lenOfTokens) {
  if (numOfTokens < 0 || lenOfTokens < 0) {
    throw new Error("Invalid Values for NumOfTokens or LengthOfTokens");
  }
  const possibleCombos =
    64 **
    lenOfTokens; /* 64 is the default number of alphabets used by nanoid() */
  lenOfTokens =
    possibleCombos < numOfTokens ? CONSTANTS.DEFAULT_TOKEN_LENGTH : lenOfTokens;

  const tokenSet = new Set();
  let duplications = 0;

  let startTime = Date.now();
  while (tokenSet.size < numOfTokens) {
    let token = nanoid(lenOfTokens);
    !tokenSet.has(token) ? tokenSet.add(token) : duplications++;
  }
  console.log(
    `Token Generation Info - Duplications: ${duplications}, Time Taken: ${
      (Date.now() - startTime) / 1000
    } seconds `
  );
  return Array.from(tokenSet);
}

async function saveTokenIntoDB(
  clientNameParam,
  tokensArrayParam,
  validityDateParam,
  redeemedStatusParam = false
) {
  let created = 0;
  try {
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
    console.error(`ERROR IN saveTokenIntoDB: ${error}`);
  } finally {
    console.log(`CREATED: ${created}`);
  }
}

async function saveTokenIntoDBInBulk(
  clientName,
  tokensArrayParam,
  validityDate,
  redeemedStatus = false
) {
  const entries = tokensArrayParam.map((tokenValue) => ({
    tokenValue,
    clientName,
    validityDate,
    redeemedStatus,
  }));

  /* model.bulkCreate(array of objects, options) */
  try {
    await TokenModel.bulkCreate(entries, { ignoreDuplicates: true });
  } catch (error) {
    console.error(`ERROR IN saveTokenIntoDBInBulk: ${error}`);
  }
}

async function redeemToken(tokenValueParam) {
  try {
    const dbResponse = await TokenModel.findByPk(tokenValueParam);
    if (dbResponse === null) {
      return process.env.TOKEN_DOES_NOT_EXIST;
    }
    await dbResponse.update({ redeemedStatus: true });
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

async function displayDataFromTokenModel(displayNElements = 10_000_000) {
  try {
    const entries = await TokenModel.findAll({ limit: displayNElements });
    if (!entries) {
      throw new Error("findAll METHOD RETURNED null");
    }
    // entries.forEach((row) => {
    //   console.log(row.dataValues);
    // });
    console.log(`${entries.length} Records Found`);
  } catch (error) {
    console.error(`ERROR IN displayDataFromTokenModel: ${error}`);
  }
}

async function emptyTokenModel() {
  try {
    await TokenModel.destroy({ where: {} });
  } catch (error) {
    console.error(`ERROR IN emptyTokenModel: ${error}`);
  }
}

module.exports = {
  generateTokens,
  saveTokenIntoDB,
  saveTokenIntoDBInBulk,
  displayDataFromTokenModel,
  emptyTokenModel,
  redeemToken,
};
const { nanoid } = require("nanoid");
const TokenModel = require("./models");
const CONSTANTS = require("./constants");
const { token } = require("morgan");
require("dotenv").config();

TokenModel.beforeBulkCreate(async (records, options) => {
  try {
    const duplicatedRecords = await TokenModel.findAll({
      where: {
        tokenValue: records.map((record) => record.tokenValue),
      },
    });
    if (duplicatedRecords.length === 0) {
      return;
    }
    console.error(`DB DUPLICATIONS: ${duplicatedRecords.length}`);
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
  lenOfTokens = handleTokenLengthConstraints(numOfTokens, lenOfTokens);
  const tokenSet = new Set();
  let duplications = 0;
  let startTime = Date.now();
  while (tokenSet.size < numOfTokens) {
    let token = nanoid(lenOfTokens);
    tokenSet.has(token) ? duplications++ : tokenSet.add(token);
  }
  console.log(
    `Token Generation Info - Duplications: ${duplications}, Time Taken: ${
      (Date.now() - startTime) / 1000
    } seconds `
  );
  return Array.from(tokenSet);
}

function handleTokenLengthConstraints(numOfTokens, lenOfTokens) {
  const possibleCombos =
    64 **
    lenOfTokens; /* 64 is the default number of alphabets used by nanoid() */
  if (
    possibleCombos < numOfTokens ||
    lenOfTokens < CONSTANTS.DEFAULT_TOKEN_LENGTH
  ) {
    return CONSTANTS.DEFAULT_TOKEN_LENGTH;
  }
  return lenOfTokens;
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
      return CONSTANTS.TOKEN_DOES_NOT_EXIST;
    }
    let redeemStatus = "Token Expired or Already Redeemed";
    if (validateToken(dbResponse)) {
      redeemStatus = "Redeemed";
    }
    await dbResponse.update({ redeemedStatus: true });
    return redeemStatus;
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
    entries.forEach((row) => {
      console.log(row.dataValues);
    });
    console.log(`${entries.length} Records Found`);
  } catch (error) {
    console.error(`ERROR IN displayDataFromTokenModel: ${error}`);
  }
}

async function getTokensFromTokenModel(
  clientName,
  numOfTokensToReturn = CONSTANTS.DEFAULT_NUMBER_OF_TOKENS_TO_RETURN_TO_CLIENT
) {
  try {
    const records = await TokenModel.findAll({
      where: {
        clientName: clientName,
        redeemedStatus: false,
      },
      limit: numOfTokensToReturn,
    });
    if (!records) {
      throw new Error("findAll METHOD RETURNED null");
    }
    console.log(`${records.length} Records Found`);
    let tokensArray = [];
    records.forEach((record) => {
      tokensArray.push(record.tokenValue);
    });
    return tokensArray;
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
  getTokensFromTokenModel,
  emptyTokenModel,
  redeemToken,
};

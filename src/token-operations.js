const { nanoid } = require("nanoid");
const { TokenModel, sequelize } = require("./models");
const CONSTANTS = require("./constants");
require("dotenv").config();

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
  try {
    await sequelize.transaction(async (transaction) => {
      await TokenModel.bulkCreate(
        entries,
        { ignoreDuplicates: true },
        { transaction }
      );
    });
  } catch (error) {
    console.error(`ERROR IN saveTokenIntoDBInBulk: ${error}`);
  }
}

let numberOfDuplicatedTokensInDB = 0;

TokenModel.beforeBulkCreate(async (records, options) => {
  try {
    numberOfDuplicatedTokensInDB = await TokenModel.count({
      where: {
        tokenValue: records.map((record) => record.tokenValue),
      },
    });
  } catch (error) {
    console.error(`ERROR IN beforeBulkCreate: ${error}`);
  }
});

TokenModel.afterBulkCreate(async (records, options) => {
  try {
    console.log(
      `[afterBulkCreation] - Tokens Duplications: ${numberOfDuplicatedTokensInDB}`
    );
    if (numberOfDuplicatedTokensInDB === 0) {
      return;
    }
    let lengthOfDuplicatedTokensInDB = records[0].tokenValue.length;
    const tokensArray = await generateTokens(
      numberOfDuplicatedTokensInDB,
      lengthOfDuplicatedTokensInDB
    );
    const { clientName, validityDate } = records[0];
    await saveTokenIntoDBInBulk(clientName, tokensArray, validityDate);
  } catch (error) {
    console.error(`ERROR IN afterBulkCreate: ${error}`);
  }
});

async function redeemToken(tokenValueParam) {
  try {
    return await sequelize.transaction(async (transaction) => {
      const dbResponse = await TokenModel.findByPk(tokenValueParam, {
        transaction,
      });
      if (dbResponse === null) {
        return CONSTANTS.TOKEN_DOES_NOT_EXIST;
      }
      let redeemStatus = "Token Expired or Already Redeemed";
      if (validateToken(dbResponse)) {
        redeemStatus = "Redeemed";
      }
      await dbResponse.update({ redeemedStatus: true }, { transaction });
      return redeemStatus;
    });
  } catch (error) {
    console.error(`ERROR INSIDE redeemToken: ${error}`);
    throw new Error(`ERROR INSIDE redeemToken: ${error}`);
  }
}

function validateToken(tokenData) {
  return !tokenData.redeemedStatus && new Date() <= tokenData.validityDate;
}

async function displayDataFromTokenModel(displayNElements = 10_000) {
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
  saveTokenIntoDBInBulk,
  displayDataFromTokenModel,
  getTokensFromTokenModel,
  emptyTokenModel,
  redeemToken,
};

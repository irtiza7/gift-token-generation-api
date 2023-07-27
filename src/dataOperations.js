const { nanoid } = require("nanoid");
const TokenModel = require("./models");
const { HostNotFoundError } = require("sequelize");

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
  clientNamee,
  tokensArray,
  validityDatee,
  redeemedStatuss = false
) {
  //   const entries = tokensArray.map((tokenValue) => ({
  //     tokenValue,
  //     clientName,
  //     validityDate,
  //     redeemedStatus,
  //   }));
  /* model.bulkCreate(array of objects, options) */
  let created = 0;
  try {
    //   await TokenModel.bulkCreate(entries, {
    //     updateOnDuplicate: ["tokenValue"],
    //   });
    for (let token of tokensArray) {
      const [record, isCreated] = await TokenModel.findOrCreate({
        where: {
          tokenValue: token,
          clientName: clientNamee,
          validityDate: validityDatee,
          redeemedStatus: redeemedStatuss,
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

function validateToken() {}

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
};

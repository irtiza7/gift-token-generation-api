const DataOperations = require("./dataOperations");

async function handleGenerateTokenRequest(req, res) {
  const clientName = req.body["clientName"];
  const numOfTokensToGen = req.body["numberOfTokensRequired"];
  const lenOfTokensToUse = req.body.lengthOfTokens;
  const validityDate = new Date(req.body["validityDate"])
    .toISOString()
    .slice(0, 10);

  let startTime = Date.now();
  const tokenSet = await DataOperations.generateTokens(
    numOfTokensToGen,
    lenOfTokensToUse
  );
  console.log(
    `Time Taken to Generate ${numOfTokensToGen} Tokens: ${
      (Date.now() - startTime) / 1000
    } seconds`
  );

  const tokenArray = Array.from(tokenSet);
  sendResponse(req, res, 200, tokenArray);

  // await DataOperations.emptyTokenModel();

  startTime = Date.now();
  await DataOperations.saveTokenIntoDB(clientName, tokenArray, validityDate);
  console.log(
    `Time Taken to Store ${numOfTokensToGen} Tokens: ${
      (Date.now() - startTime) / 1000 / 60
    } minutes`
  );

  // await DataOperations.displayDataFromTokenModel();

  console.log("REQUEST HANDLED \n");
}

async function handleRedeemTokenRequest(req, res) {}

async function sendResponse(
  req,
  res,
  statusCode = 204,
  resData = "NO DATA TO SEND"
) {
  try {
    res.json(resData);
  } catch (error) {
    console.error("ERROR INSIDE sendResponse: ", error);
  }
}

module.exports = { handleGenerateTokenRequest, handleRedeemTokenRequest };

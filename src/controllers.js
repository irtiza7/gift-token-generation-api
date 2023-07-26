const DataOperations = require("./dataOperations");
const generateTokens = require("./generateTokenFunctions");

async function handleGenerateTokenRequest(req, res) {
  const numberOfTokens = req.body["numberOfTokensRequired"];
  const lengthOfTokens = req.body.lengthOfTokens;
  const validTill = req.body["validTill"];

  let startingTimeInMS = Date.now();
  const tokenSet = await generateTokens(numberOfTokens, lengthOfTokens);
  console.log(
    `Time taken for ${numberOfTokens} Tokens: ${
      (Date.now() - startingTimeInMS) / 1000
    }`
  );

  const data = { tokens: Array.from(tokenSet) };
  sendResponse(req, res, 200, data);
}

async function handleRedeemTokenRequest(req, res) {}

async function sendResponse(
  req,
  res,
  statusCode = 204,
  resData = "NO DATA TO SEND"
) {
  try {
    res.send(resData);
  } catch (error) {
    console.error("ERROR INSIDE sendResponse: ", error);
  }
}

module.exports = { handleGenerateTokenRequest, handleRedeemTokenRequest };

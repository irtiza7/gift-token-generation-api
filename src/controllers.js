const DataOperations = require("./dataOperations");
const genTokensAccordingToDigits = require("./generateTokenFunctions");

async function handleGenerateTokenRequest(req, res) {
  const numberOfTokens = req.body["numberOfTokensRequired"];
  const validTill = req.body["validTill"];

  let stime = Date.now();
  const tokenSet = await genTokensAccordingToDigits(numberOfTokens);
  console.log(
    `Time taken to Generate ${numberOfTokens} Tokens: ${
      (Date.now() - stime) / 1000
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

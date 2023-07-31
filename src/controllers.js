const TokenOperations = require("./token-operations");

async function handleGenerateTokenRequest(req, res) {
  const { clientName, numberOfTokensRequired, lengthOfTokens } = req.body;
  const validityDate = new Date(req.body.validityDate)
    .toISOString()
    .slice(0, 10);
  const tokens = await TokenOperations.generateTokens(
    numberOfTokensRequired,
    lengthOfTokens
  );
  sendResponse(req, res, 200, tokens); ///// HANDLE THE RESPONSE /////
  const startTime = Date.now();
  await TokenOperations.saveTokenIntoDBInBulk(clientName, tokens, validityDate);
  console.log(
    `Storing Time for ${numberOfTokensRequired} Tokens: ${
      (Date.now() - startTime) / 1000 / 60
    } minutes`
  );
  console.log("REQUEST HANDLED \n\n\n");
}

async function handleRedeemTokenRequest(req, res) {
  const tokenValue = req.body["tokenValue"];
  let redeemedStatus;
  try {
    redeemedStatus = await TokenOperations.redeemToken(tokenValue);
  } catch (error) {
    redeemedStatus = "Could't process request right now";
  } finally {
    sendResponse(req, res, 200, redeemedStatus);
  }
  console.log("REQUEST HANDLED \n\n\n");
}

async function handledDisplayDataRequest(req, res) {
  const { displayNElements } = req.body;
  await TokenOperations.displayDataFromTokenModel(displayNElements);
  sendResponse(req, res, 200, "Data Displayed on Console");
  console.log("REQUEST HANDLED \n\n\n");
}

async function handleDeleteDataRequest(req, res) {
  await TokenOperations.emptyTokenModel();
  sendResponse(req, res, 200, "All Data Deleted From Database");
  console.log("REQUEST HANDLED \n\n\n");
}

async function sendResponse(
  req,
  res,
  statusCode = 204,
  resData = "NO DATA TO SEND"
) {
  try {
    res.json(resData);
  } catch (error) {
    console.error(`ERROR INSIDE sendResponse: ${error}`);
  }
}

module.exports = {
  handleGenerateTokenRequest,
  handleRedeemTokenRequest,
  handledDisplayDataRequest,
  handleDeleteDataRequest,
};

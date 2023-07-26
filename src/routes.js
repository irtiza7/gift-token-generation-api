const Controllers = require("./controllers");

const Express = require("express");
const Router = Express.Router();

Router.post("/api/generate_tokens", Controllers.handleGenerateTokenRequest);
Router.post("/api/redeem_token", Controllers.handleRedeemTokenRequest);

module.exports = Router;

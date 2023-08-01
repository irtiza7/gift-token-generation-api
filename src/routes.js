const Controllers = require("./controllers");

const Express = require("express");
const Router = Express.Router();

Router.post("/api/generate_tokens", Controllers.handleGenerateTokenRequest);
Router.post("/api/redeem_token", Controllers.handleRedeemTokenRequest);

Router.get("/api/get_tokens", Controllers.handleGetTokensRequest);
Router.get("/api/dev/display_data", Controllers.handledDisplayDataRequest);

Router.delete("/api/dev/delete_all_data", Controllers.handleDeleteDataRequest);

module.exports = Router;

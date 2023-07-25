const Controllers = require("./controllers");

const Express = require("express");
const Router = Express.Router();

Router.post("/api/generate-tokens");
Router.post("/api/redeem-token");

module.exports = Router;

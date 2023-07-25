const Express = require("express");
const Morgan = require("morgan");
const Router = require("./routes");

const app = Express();

app.use(Morgan("combined"));
app.use(Express.json());

app.listen(process.env.PORT, () => {
  console.log(
    `Listening at http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
  );
});

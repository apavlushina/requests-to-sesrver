const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    message: "We received your request body!"
  });
});
app.listen(port, () => console.log("listening on port " + port));

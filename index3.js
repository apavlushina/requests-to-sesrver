const express = require("express");
const app = express();
const port = 3000;

const loggingMiddleware = (req, res, next) => {
  const time = new Date().toString();
  console.log("request received at " + time);
  res.setHeader("X-Codaisseur-Time", time);
  next();
};
const failRandomlyMiddleware = (req, res, next) => {
  if (Math.random() < 0.5) {
    res.status(500).end();
  } else {
    next();
  }
};

app.use(loggingMiddleware);
app.get("/foo", (req, res) => res.send("Hello"));
app.get("/", failRandomlyMiddleware, (req, res) => res.send("Hello"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));

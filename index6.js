const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res, next) => {
  if (Math.random() < 0.5) {
    res.send("ok");
  } else {
    // Calling next with an argument (of any kind)
    //  causes Express to treat it as an error
    // This then causes a 500 error
    next("not ok");
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

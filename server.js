const express = require("express");
const app = express();
// const bodyParser = require('body-parser')

// const cors = require('cors')

require("./db/mongoose");
const userRouter = require("./routers/user");
const exerciseRouter = require("./routers/exercise");
// app.use(cors())

/**
 * Earlier versions of Express used to have a lot of middleware bundled with it.
 * bodyParser was one of the middlewares that came it.
 * When Express 4.0 was released they decided to remove the bundled middleware from Express and make them separate packages instead.
 * The syntax then changed from app.use(express.json()) to app.use(bodyParser.json()) or app.use(express.urlencoded()) after installing the bodyParser module.
 *
 * bodyParser was added back to Express in release 4.16.0, because people wanted it bundled with Express like before.
 * That means you don't have to use bodyParser.json() anymore if you are on the latest release. You can use express.json() instead.
 * app.use(express.urlencoded()) : decodes "urlencoded" requests (form submissions)
 * app.use(bodyParser.json()) : decodes "json" requests
 *
 */
app.use(express.urlencoded({ extended: false }));
// app.use(express.json())

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use(userRouter);
app.use(exerciseRouter);

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res
    .status(errCode)
    .type("txt")
    .send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

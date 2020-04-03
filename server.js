const express = require("express");
const app = express();
// const bodyParser = require('body-parser')

// const cors = require('cors')

require("./db/mongoose");
const User = require("./models/user");
const Exercise = require("./models/exercise");
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

// End-Point to create a new user
// POST /api/exercise/new-user
app.post("/api/exercise/new-user", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// End-Point to add a new exercise
// POST /api/exercise/add
// {"username":"adsdasadsda","description":"asdads","duration":20,"_id":"r1QbQpNwL","date":"Wed May 20 2015"}
app.post("/api/exercise/add", async (req, res) => {
  try {
    const { description, duration,  userId } = req.body;
    let { date } = req.body;
    if(!date) {
      let dateArray = new Date().toISOString().split("");
      const index = dateArray.indexOf("T");
      dateArray.splice(index);
      console.log(dateArray.join(""));
      date =  dateArray.join("");
    };
    
    const exercise = new Exercise({
      description,
      duration,
      date,
      // ObjectId(): I don't need to provide ObjectId(), mongoose will convert _id string to ObjectId automatically for me.
      owner: userId
    });
    await exercise.save();
    const user = await User.findById(userId);
    const username = await user.username
    res.send({
      username,
      description: exercise.description,
      duration: exercise.duration,
      _id: exercise._id,
      date: exercise.date
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// End-Point to get all the users
// [{"_id":"BkP-DPnHe","username":"hello","__v":0}]
app.get("/api/exercise/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(await users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// End-Point to get all exercises
// GET /api/exercise/log?{userId}
// {"_id":"r1QbQpNwL","username":"adsdasadsda","count":1,"log":[{"description":"asdads","duration":20,"date":"Wed May 20 2015"}]}
app.get("/api/exercise/log", async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    await user.populate("exercises").execPopulate();
    res.send({
      _id: await user._id,
      username: await user.username,
      count: await user.exercises.length,
      log: await user.exercises
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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

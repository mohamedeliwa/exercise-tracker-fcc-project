const express = require("express");
const Exercise = require("../models/exercise");
const User = require("../models/user");

const router = new express.Router();

// End-Point to add a new exercise
// POST /api/exercise/add
// {"username":"adsdasadsda","description":"asdads","duration":20,"_id":"r1QbQpNwL","date":"Wed May 20 2015"}
router.post("/api/exercise/add", async (req, res) => {
  try {
    const { description, duration, date, userId } = req.body;

    const regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/g;
    if (!regex.test(date) && date) {
      throw new Error("Wrong Date Format!");
    }

    const exercise = new Exercise({
      description,
      duration,
      date: date ? date : new Date(),
      // ObjectId(): I don't need to provide ObjectId(), mongoose will convert _id string to ObjectId automatically for me.
      owner: userId,
    });
    await exercise.save();
    const user = await User.findById(userId);
     res.send({
      username: await user.username,
      description: await exercise.description,
      duration: await exercise.duration,
      _id: await user._id,
      date: await exercise.date,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// End-Point to get all exercises
// GET /api/exercise/log?{userId}[&from][&to][&limit]
// {"_id":"r1QbQpNwL","username":"adsdasadsda","count":1,"log":[{"description":"asdads","duration":20,"date":"Wed May 20 2015"}]}
router.get("/api/exercise/log", async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    await user.populate("exercises").execPopulate();
    let exercises = await user.exercises;
    if (req.query.from) exercises = await exercises.filter(exe => exe.date > new Date(req.query.from));
    if (req.query.to)  exercises = await exercises.filter(exe =>  exe.date < new Date (req.query.to));
    if (req.query.limit ) exercises = await exercises.slice(0,req.query.limit)
    res.send({
      _id: await user._id,
      username: await user.username,
      count: await exercises.length,
      log: await exercises
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

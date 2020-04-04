const express = require("express");
const User = require("../models/user");

const router = new express.Router();

// End-Point to create a new user
// POST /api/exercise/new-user
router.post("/api/exercise/new-user", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// End-Point to get all the users
// [{"_id":"BkP-DPnHe","username":"hello","__v":0}]
router.get("/api/exercise/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(await users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

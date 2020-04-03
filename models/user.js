const mongoose = require("mongoose");

// Creating a mongoose Schema, to get functionality of midllewares, also to be able to create static methods on schemas
// first argument is the schema itself, the second argument is for options like timestamps
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      trim: true
    }
  },
  {
    // each task will be created with two additional fields
    // first when it's created, second when it's modified
    timestamps: true
  }
);

// Setting up a virtual property for user
// this property will contain all exercises that user has created, but it will be virtual property
// i.e not really created in the db. i.e not really added to the user object in the db.
// it's not an acutal data stored in the db, it's just a relationship between the user and his exercises.
// schema.virtual( "name of the virtual property", { object configuring the individual field in the property})
userSchema.virtual("exercises", {
    // reference to Task model
    ref: "Exercise",
    // name of local field where the value of the foreignField is stored here locally
    // the owner field stores the _id of the user, so the local field is _id
    localField: "_id",
    // the name of the field on the Task module that's going to create the relationship
    foreignField: "owner"
});

// Defining toJSON() method that returns only public accessible URL informations
// toJSON() is a built in method that runs before JSON.stringfy() runs.
// we redefined it to modify our USER object before stringfying it to JSON and sending it in our response.
userSchema.methods.toJSON = function () {
  const user = this;
  
  // creating a copy of url object, so we can modify it without mutating the original user object.
  const userObject = user.toObject();
  delete userObject.createdAt;
  delete userObject.updatedAt;
  delete userObject.__v;

  return userObject;
}

/**
 * Creating a Url model.
 * Each task inserted in the db should follow that model specifications
 */

const User = mongoose.model("User", userSchema);

module.exports = User;

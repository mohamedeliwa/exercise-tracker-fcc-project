const mongoose = require("mongoose");

// Creating a mongoose Schema, to get functionality of midllewares, also to be able to create static methods on schemas
// first argument is the schema itself, the second argument is for options like timestamps
const exerciseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    date: {
      type: Date,
      required: true,
    },
    owner: {
      // set type of owner to ObjectID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // using this owner field as a reference to another model. in this case "User".
      // this will allow us to set a relationship between the task and its creator
      // the value here is the name of the model we want reference to.
      ref: "User",
    },
  },
  {
    // each task will be created with two additional fields
    // first when it's created, second when it's modified
    timestamps: true,
  }
);

// Defining toJSON() method that returns only public accessible URL informations
// toJSON() is a built in method that runs before JSON.stringfy() runs.
// we redefined it to modify our Exercise object before stringfying it to JSON and sending it in our response.
exerciseSchema.methods.toJSON = function () {
  const exercise = this;

  // creating a copy of url object, so we can modify it without mutating the original user object.
  const exerciseObject = exercise.toObject();
  delete exerciseObject.createdAt;
  delete exerciseObject.updatedAt;
  delete exerciseObject.__v;
  delete exerciseObject.owner;
  return exerciseObject;
};

const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = Exercise;

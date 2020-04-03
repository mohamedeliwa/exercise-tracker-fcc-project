const mongoose = require("mongoose");

// Creating a mongoose Schema, to get functionality of midllewares, also to be able to create static methods on schemas
// first argument is the schema itself, the second argument is for options like timestamps
const exerciseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 4
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    date: {
      type: String,
      required: true,
      validate: [
        {
          validator: value => {
            value = value
              .split("-")
              .reverse()
              .join("-");
              // ^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$
            const regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/g;
            return regex.test(value);
          },
          message: "Wrong Date Formate! by Regex"
        }
      ]
    },
    owner: {
      // set type of owner to ObjectID
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // using this owner field as a reference to another model. in this case "User".
      // this will allow us to set a relationship between the task and its creator
      // the value here is the name of the model we want reference to.
      ref: "User"
    }
  },
  {
    // each task will be created with two additional fields
    // first when it's created, second when it's modified
    timestamps: true
  }
);

// Defining toJSON() method that returns only public accessible URL informations
// toJSON() is a built in method that runs before JSON.stringfy() runs.
// we redefined it to modify our Exercise object before stringfying it to JSON and sending it in our response.
exerciseSchema.methods.toJSON = function() {
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

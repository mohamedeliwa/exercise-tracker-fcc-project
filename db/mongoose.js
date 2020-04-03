const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  // These options are set To fix all deprecation warnings
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

// We now need to get notified if we connect successfully or if a connection error occurs:
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongoDB Connected!");
})

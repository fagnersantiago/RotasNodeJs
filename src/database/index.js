
const mongoose = require("mongoose");
const connect = require("../config/config");

const url = connect.stringDbConnection ;

const option = { poolSize: 5, useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(url, option);

mongoose.connection.on("error", (err) => {
  console.log("fail connection" + err);
});

mongoose.connection.on("disconnect", () => {
  console.log("Disconnect ");
});

mongoose.connection.on("connected", () => {
  console.log("connected!");
});


module.exports = mongoose;
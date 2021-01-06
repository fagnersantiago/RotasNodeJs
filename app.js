const express = require("express");
const app = express();
const Users = require("./src/user");
const bcrypt = require("bcrypt");
const database = require("./src/database/index");
const user = require("./src/user");

app.use(express.json());

// const projects = [];

function handleLogRequest(request, response, next) {
  const { method, url } = request;

  const logRequest = `[${method.toUpperCase()} ${url}]`;

  console.log(logRequest);

  return next();
}

//app.use(handleLogRequest);

app.get("/", async (request, response) => {
  try {
    const user = await Users.find({});

    return response.json(user);
  } catch (err) {
    return response.json({ err: "User not found" });
  }
});

app.post("/user", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) return response.json("invalid data");
  if (await Users.findOne({ email }))

    return response.json({ message: "User already exist" });

  try {

    const user = await Users.create({ email, password });

    return response.json(user);

  } catch (err) {

    return response.json({ err: "Error" });

  }
});

app.post("/user/auth", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password)

    return response.json({ message: "unsufficient data" });

    try {
 
      const user = await Users.findOne({ email }).select('+password');

      if(!user) return response.json({message:"User Unregistered"});

     const comparePassword = await bcrypt.compare(password, user.password) 

     if(!comparePassword) return response.json({message:'Erro authenticated'})

       return response.json(user);

    } catch(err){

      return response.json({err:"User does not exist"});
    }
});



module.exports = app;

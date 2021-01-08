const express = require("express");
const app = express();
const Users = require("./src/user");
const bcrypt = require("bcrypt");
const auth = require("./src/middlewares/index");
const database = require("./src/database/index");
const jwt = require("jsonwebtoken");
const config = require("./src/config/config");
const { response } = require("express");


app.use(express.json());

const userToken = (user) => {
  return jwt.sign({ id: user }, config.jwt_pass, {
    expiresIn: config.jwt_expires_in,
  });
};

app.get("/", auth, async (request, response) => {
  try {
    const user = await Users.find({});

    return response.json(user);
  } catch (err) {
    return response.status(500).json({ err: "User not found" });
  }
});

app.post("/user", async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) return response.status(401).json("invalid data");
  if (await Users.findOne({ email }))
    return response.json({ message: "User already exist" });

  try {
    const user = await Users.create({ email, password });

    return response.status(201).json({ user, token: userToken(user.id) });
  } catch (err) {
    return response.status(200).json({ err: "Error" });
  }
});

app.post("/user/auth", async (request, response) => {
  const { email, password } = request.body;

  
  if (!email || !password)
    return response.json({ message: "unsufficient data" });

  try {
    const user = await Users.findOne({ email }).select("+password");

    if (!user)
      return response.status(404).json({ message: "User Unregistered" });

    const comparePassword = await bcrypt.compare(password, user.password);
    
    if (!comparePassword)
      return response.status(401).json({ message: "Erro authenticated" });

    return response.json({ user, token: userToken(user.id) });
  } catch (err) {
    return response.status(404).json({ err: "User does not exist" });
  }
});

app.delete("/user/:id", async (request, response) => {
  try {
    await Users.findByIdAndRemove(request.params.id);

    return response.send("User deleted");
  } catch (err) {
    return response.status(400).json({ err: "Error deleting user" });
  }
});

module.exports = app;

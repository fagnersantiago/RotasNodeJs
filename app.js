const express = require("express");
const app = express();
const Users = require("./src/user");
const bcrypt = require("bcrypt");
const auth = require('./src/middlewares/index');
const database = require("./src/database/index");
const jwt = require("jsonwebtoken");

app.use(express.json());

const userToken = (user) => {
  return jwt.sign({ id: user }, "secret", { expiresIn: "7d" });
};

app.get("/", auth, async (request, response) => {
  try {
    const user = await Users.find({});

    return response.json(user);
  } catch (err) {
    return response.json({ err: "User not found" });
  }
});

app.post("/user", auth,  async (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) return response.json("invalid data");
  if (await Users.findOne({ email }))
    return response.json({ message: "User already exist" });

  try {
    const user = await Users.create({ email, password });

    return response.json({ user, token: userToken(user.id) });
  } catch (err) {
    return response.json({ err: "Error" });
  }
});

app.post("/user/auth", auth, async (request, response) => {

  const { email, password } = request.body;

  if (!email || !password)
    return response.json({ message: "unsufficient data" });

  try {
    const user = await Users.findOne({ email }).select("+password");

    if (!user) return response.json({ message: "User Unregistered" });

    const comparePassword = await bcrypt.compare(password, user.password);
    console.log(response.locals.IdUser);
    if (!comparePassword)
      return response.json({ message: "Erro authenticated" });

    return response.json({ user, token: userToken(user.id) });
  } catch (err) {
    return response.json({ err: "User does not exist" });
  }
});

module.exports = app;

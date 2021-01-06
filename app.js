const express = require("express");
const app = express();
const Users = require("./src/user");
const bcrypt = require("bcrypt");
const database = require ('./src/database/index');


app.use(express.json());

// const projects = [];

function handleLogRequest(request, response, next) {
  const { method, url } = request;

  const logRequest = `[${method.toUpperCase()} ${url}]`;

  console.log(logRequest);

  return next();
}

//app.use(handleLogRequest);

app.get("/", (request, response) => {
  Users.find({}, (err, data) => {
    if (err) return response.json("user not found");

    return response.json(data);
  });
});

app.post("/user", handleLogRequest, (request, response) => {
  const { email, password } = request.body;

  if (!email || !password) return response.json("invalid data");

  Users.findOne({ email }, (err, data) => {
    if (err) return response.json("error");
    if (data) return response.json("user already exist");

    Users.create(request.body, (err, data) => {
      if (err) return response.json(err);

      return response.json(data);
    });
  });
});

app.post("/user/auth", (request, response) => {
  const { email, password } = request.body;

  if (!email || !password)
    return response.json({ message: "unsufficient data" });

  Users.findOne({ email }, (err, data) => {
    if (err) return response.json({ message: "Error fetching data" });
    if (!data) return response.json({ message: "User Unregistered" });

    bcrypt.compare(password, data.password, (err, same) => {
      if (!same) return response.json({ message: "Error authenticate" });

      return response.json(data);
    });
  }).select("+password");
});

// app.put("/projects/:id", handleLogRequest,(request, response) => {
//   const { id } = request.params;
//   const { title, owner } = request.body;

//   const projectIndex = projects.findIndex((project) => project.id === id);

//   if (projectIndex === -1) {
//     return response.status(400).json({ error: "project not found." });
//   }

//   const project = {
//     id,
//     title,
//     owner,
//   };

//   projects[projectIndex] = project;

//   return response.json(project);
// });

// app.delete("/projects/:id", (request, response) => {
//   const { id } = request.params;

//   const projectId = projects.findIndex((project) => project.id === id);

//   if (projectId !== id) {
//     return response
//       .status(400)
//       .json({ error: "Project not found or Id does not exist" });
//   }

//   projects.splice(projectId, 1);

//   return response.status(204).send();
// });

module.exports = app;

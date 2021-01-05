const express = require("express");
const app = express();
const Users = require("./user");
const mongoose = require("mongoose");

app.use(express.json());

const url = "mongodb+srv://admin:<password>@cluster0.jvjxd.mongodb.net/<dbname>?retryWrites=true&w=majority";

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

app.listen(3333, () => {
  console.log("🚀 Back-end started on port 3333!");
});

module.exports = app;

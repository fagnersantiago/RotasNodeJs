const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const projects = [];

app.get("/", (request, response) => {
  // const {title, owner} = request.query;

  // console.log(title)
  // console.log(owner)

  // return response.json([
  //     'project 1',
  //     'project 2',
  //     'project 3',
  // ])

  return response.json(projects);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuidv4(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put("/projects/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex === -1) {
    return response.status(400).json({ error: "project not found." });
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);

});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectId = projects.findIndex((project) => project.id === id);

  if (projectId !== id) {
    return response
      .status(400)
      .json({ error: "Project not found or Id does not exist" });
  }

  projects.splice(projectId, 1);

  return response.status(204).send();
  
});

app.listen(3333, () => {
  console.log("🚀 Back-end started on port 3333!");
});

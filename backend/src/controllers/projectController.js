const getProjects = (req, res) => {
  res.send("all projects");
};
const getProjectById = (req, res) => {
  res.send(`Project ID: ${req.params.id}`);
};
const createProject = (req, res) => {
  console.log(req.body);
  res.send(req.body);
};
const updateProject = (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res.send({
    id: req.params.id,
    updatedData: req.body,
  });
};
const deleteProject = (req, res) => {
  console.log(req.body);
  res.send(`Project ${req.params.id} delete`);
};
module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};

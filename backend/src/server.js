const express = require("express");

const projectRoutes = require("./routes/projectRoutes");

const rolesRoutes = require("./routes/roleRoutes");

const messageRoutes = require("./routes/messageRoutes");

const userRoutes = require("./routes/userRoutes");

const profileRoutes = require("./routes/profileRoutes");

const projectSkillRoutes = require("./routes/projectSkillRoutes");

const favoriteRoutes = require("./routes/favoriteRoutes");

const educationRoutes = require("./routes/educationRoutes");

const skillRoutes = require("./routes/skillRoutes");

const experienceRoutes = require("./routes/experienceRoutes");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/projects", projectRoutes);

app.use("/roles", rolesRoutes);

app.use("/messages", messageRoutes);

app.use("/users", userRoutes);

app.use("/profiles", profileRoutes);

app.use("/project-skills", projectSkillRoutes);

app.use("/skills", skillRoutes);

app.use("/favorites", favoriteRoutes);

app.use("/education", educationRoutes);

app.use("/experience", experienceRoutes);

app.get("/", (req, res) => {
  console.log(req.method);

  console.log(req.url);

  res.send("Hello");
});

app.listen(5000, () => {
  console.log("server running");
});

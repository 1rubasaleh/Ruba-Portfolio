const express = require("express");

const projectRoutes = require("./routes/projectRoutes");

const rolesRoutes = require("./routes/roleRoutes");

const messageRoutes = require("./routes/messageRoutes");

const userRoutes = require("./routes/userRoutes");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());

app.use("/projects", projectRoutes);

app.use("/roles", rolesRoutes);

app.use("/messages", messageRoutes);

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  console.log(req.method);

  console.log(req.url);

  res.send("Hello");
});

app.listen(5000, () => {
  console.log("server running");
});

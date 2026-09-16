const express = require("express");
const projectRoutes = require("./routes/projectRoutes");
const connectDB = require("./config/db");
const app = express();
connectDB();
app.use(express.json());
app.use("/projects", projectRoutes);
app.get("/", (req, res) => {
  console.log(req.method);
  console.log(req.url);

  res.send("Hello");
});
app.listen(5000, () => {
  console.log("server running");
});

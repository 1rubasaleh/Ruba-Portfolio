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

const skillCategoryRoutes = require("./routes/SkillCategoriesRoutes");

const experienceRoutes = require("./routes/experienceRoutes");

const authRoutes = require("./routes/authRoutes");

const connectDB = require("./config/db");

const app = express();

const configuredOrigins = process.env.FRONTEND_ORIGINS
  ? process.env.FRONTEND_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:4173",
      "http://127.0.0.1:4173",
    ];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && !configuredOrigins.includes(origin)) {
    return res.status(403).json({ message: "Origin is not allowed" });
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());

app.use("/projects", projectRoutes);

app.use("/roles", rolesRoutes);

app.use("/messages", messageRoutes);

app.use("/users", userRoutes);

app.use("/profiles", profileRoutes);

app.use("/project-skills", projectSkillRoutes);

app.use("/skills", skillRoutes);

app.use("/skill-categories", skillCategoryRoutes);

app.use("/favorites", favoriteRoutes);

app.use("/education", educationRoutes);

app.use("/experience", experienceRoutes);

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Ruba Portfolio API" });
});

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured before starting the API.");
  }

  await connectDB();

  const port = Number(process.env.PORT || 5000);
  return app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error("API startup failed:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, startServer };

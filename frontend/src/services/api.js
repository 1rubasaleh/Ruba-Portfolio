const configuredApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");

export const PORTFOLIO_TOKEN = "portfolio_token";
export const PORTFOLIO_FAVORITES = "portfolio_favorites";

export const portfolioProjects = [
  {
    id: "spotter-trip-planner",
    slug: "spotter-trip-planner",
    title: "Spotter Trip Planner",
    description:
      "A full-stack trip-planning application developed for a technical coding assessment. It plans truck routes and HOS-aware schedules, then presents driving time, distance, fuel and rest stops, and ELD logs alongside a route map.",
    technologies: [
      "React",
      "Python",
      "Django",
      "Django REST Framework",
      "Leaflet",
      "OSRM",
      "Nominatim",
    ],
    githubUrl: "https://github.com/1rubasaleh/Spotter-Trip-Planner",
    liveUrl: "https://spotter-trip-planner-delta.vercel.app/",
    imageUrl: "",
    category: "Full-stack application",
    details: {
      problem:
        "The assessment called for a trip planner that can account for truck route inputs and driver Hours of Service while making the resulting plan easy to inspect.",
      implementation:
        "A React interface sends the current location, pickup, dropoff, and used cycle hours to a Django REST Framework endpoint. The backend geocodes locations with Nominatim, requests a driving route from OSRM, calculates schedule and stop information, and returns route geometry for the Leaflet map.",
      features: [
        "Current location, pickup, and dropoff inputs",
        "Route distance and estimated driving time",
        "HOS-aware daily schedules and ELD logs",
        "Fuel and rest-stop planning",
        "Route and stop visualization on an interactive map",
      ],
    },
  },
  {
    id: "weather-app",
    slug: "weather-app",
    title: "Weather App",
    description:
      "A responsive weather dashboard that searches live city conditions and shows current weather with a five-day forecast. It also supports location-based weather, Celsius/Fahrenheit switching, recent searches, and loading and error states.",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "OpenWeatherMap API",
      "Geolocation API",
      "LocalStorage",
    ],
    githubUrl: "https://github.com/1rubasaleh/weather-app",
    liveUrl: "https://weather-app-ruby-ten-92.vercel.app/",
    imageUrl: "",
    category: "Frontend application",
  },
];

export const fallbackProjects = portfolioProjects;

export const fallbackSkills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "JavaScript", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "SQL Server", "C#", "ASP.NET MVC"],
  },
  {
    category: "Tools & platforms",
    items: ["Git", "GitHub", "APIs"],
  },
  {
    category: "Developing",
    items: ["Python"],
  },
];

export const getStoredFavorites = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem(PORTFOLIO_FAVORITES) || "[]");
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
};

export const setStoredFavorites = (favorites) => {
  localStorage.setItem(PORTFOLIO_FAVORITES, JSON.stringify(favorites));
};

export const getAuthToken = () => localStorage.getItem(PORTFOLIO_TOKEN) || "";

export const setAuthToken = (token) => {
  if (!token) {
    localStorage.removeItem(PORTFOLIO_TOKEN);
    return;
  }

  localStorage.setItem(PORTFOLIO_TOKEN, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(PORTFOLIO_TOKEN);
  localStorage.removeItem("portfolio_user");
};

export const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(normalized));
    return decoded;
  } catch {
    return null;
  }
};

const request = async (path, options = {}, authenticated = false) => {
  if (!API_BASE_URL) {
    throw new Error(
      "The API URL is not configured. Set VITE_API_URL to the backend origin and rebuild the frontend.",
    );
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authenticated) {
    const token = getAuthToken();
    if (!token) {
      throw new Error("Please log in to continue.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        `Could not connect to the portfolio API at ${API_BASE_URL}. Check that the backend is running and that this frontend origin is allowed by FRONTEND_ORIGINS.`,
        { cause: error },
      );
    }
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const error = new Error(
      payload?.message || payload || `Request failed (${response.status})`,
    );
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const loginUser = async (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = async (formData) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    }),
  });

export const fetchCurrentUser = async () => request("/auth/me", {}, true);

export const submitContactMessage = async (formData) =>
  request("/messages", {
    method: "POST",
    body: JSON.stringify(formData),
  });

const normalizeProjects = (items = []) =>
  items.map((project, index) => ({
    id: project.ProjectId ?? project.id ?? index + 1,
    title: project.Title ?? project.title ?? "Project",
    description:
      project.Description ??
      project.description ??
      "A modern project built with a clean and practical development workflow.",
    technologies: Array.isArray(project.Technologies)
      ? project.Technologies
      : Array.isArray(project.technologies)
        ? project.technologies
        : ["React", "Node.js"],
    githubUrl: project.GitHubUrl ?? project.githubUrl ?? "",
    liveUrl: project.LiveUrl ?? project.liveUrl ?? "",
    imageUrl: project.ImageUrl ?? project.imageUrl ?? "",
  }));

const projectIdentity = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const mergePortfolioProjects = (apiProjects) =>
  portfolioProjects.map((portfolioProject) => {
    const matchingProject = apiProjects.find((apiProject) => {
      const normalizedName = projectIdentity(apiProject.title);
      const githubUrl = apiProject.githubUrl.toLowerCase();
      const identity = projectIdentity(portfolioProject.title);

      return (
        normalizedName === identity ||
        githubUrl === portfolioProject.githubUrl.toLowerCase()
      );
    });

    if (!matchingProject) {
      return portfolioProject;
    }

    return {
      ...portfolioProject,
      id: matchingProject.id ?? portfolioProject.id,
      description: matchingProject.description || portfolioProject.description,
      githubUrl: matchingProject.githubUrl || portfolioProject.githubUrl,
      liveUrl: matchingProject.liveUrl || portfolioProject.liveUrl,
      imageUrl: matchingProject.imageUrl || portfolioProject.imageUrl,
    };
  });

const normalizeSkills = (items = []) =>
  items.map((skill, index) => ({
    id: skill.SkillId ?? skill.id ?? index + 1,
    name: skill.Name ?? skill.name ?? "Skill",
    category: skill.CategoryName ?? skill.category ?? "General",
    iconUrl: skill.IconUrl ?? skill.iconUrl ?? "",
  }));

export const fetchProjects = async () => {
  const response = await request("/projects");
  return mergePortfolioProjects(
    normalizeProjects(Array.isArray(response) ? response : []),
  );
};

export const fetchSkills = async () => {
  const response = await request("/skills");
  const skills = normalizeSkills(Array.isArray(response) ? response : []);

  if (skills.length === 0) {
    return fallbackSkills;
  }

  const groups = new Map();
  skills.forEach((skill) => {
    const category = skill.category || "General";
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(skill.name);
  });
  return Array.from(groups, ([category, items]) => ({ category, items }));
};

export const fetchProfiles = () => request("/profiles");
export const fetchEducation = () => request("/education");
export const fetchExperiences = () => request("/experience");
export const fetchSkillCategories = () => request("/skill-categories");
export const fetchMessages = () => request("/messages", {}, true);

export const adminRequest = (path, method = "GET", body) =>
  request(
    path,
    {
      method,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    },
    true,
  );

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const dataDirectory = path.join(__dirname, "data");
const dataFile = path.join(dataDirectory, "crm-data.json");
const usersFile = path.join(dataDirectory, "users.json");
const secretFile = path.join(dataDirectory, ".auth-secret");
const recordTypes = [
  "clients",
  "leads",
  "projects",
  "deals",
  "tasks",
  "calendar",
  "employees",
  "tickets",
];

function makeRecord(type, name, company, detail, status, value, owner) {
  return {
    id: crypto.randomUUID(),
    type,
    name,
    company,
    detail,
    status,
    value,
    owner,
    updatedAt: new Date().toISOString(),
  };
}

const initialRecords = [
  makeRecord("clients", "Tata Consultancy Services", "TCS", "Enterprise client", "Active", 45600000, "Emily Davis"),
  makeRecord("clients", "Infosys Limited", "Infosys", "Technology partner", "Active", 32100000, "Michael Scott"),
  makeRecord("clients", "Wipro Technologies", "Wipro", "Strategic account", "Active", 28500000, "Sarah Wilson"),
  makeRecord("clients", "Tech Mahindra", "Tech Mahindra", "Enterprise account", "Active", 21500000, "David Brown"),
  makeRecord("clients", "HCL Technologies", "HCL", "Technology partner", "Active", 19800000, "John Smith"),
  makeRecord("leads", "Cloud migration", "Tata Consultancy Services", "Enterprise cloud migration", "Qualified", 12800000, "Emily Davis"),
  makeRecord("leads", "AI solution", "Infosys Limited", "AI automation proposal", "Proposal", 8400000, "Michael Scott"),
  makeRecord("leads", "Cyber security", "Wipro Technologies", "Security modernization", "Qualified", 6200000, "Sarah Wilson"),
  makeRecord("leads", "Data analytics", "Tech Mahindra", "Analytics platform", "Proposal", 4100000, "David Brown"),
  makeRecord("leads", "ERP implementation", "HCL Technologies", "ERP transformation", "Negotiation", 3600000, "John Smith"),
  makeRecord("deals", "Cloud migration", "Tata Consultancy Services", "Enterprise cloud migration", "Proposal", 12800000, "Emily Davis"),
  makeRecord("deals", "AI solution", "Infosys Limited", "AI automation proposal", "Negotiation", 8400000, "Michael Scott"),
  makeRecord("deals", "Cyber security", "Wipro Technologies", "Security modernization", "Qualified", 6200000, "Sarah Wilson"),
  makeRecord("deals", "Data analytics", "Tech Mahindra", "Analytics platform", "Proposal", 4100000, "David Brown"),
  makeRecord("deals", "ERP implementation", "HCL Technologies", "ERP transformation", "Qualified", 3600000, "John Smith"),
  makeRecord("projects", "Website Revamp", "Tata Consultancy Services", "Redesign and launch", "In progress", 850000, "Sarah Wilson"),
  makeRecord("projects", "Customer portal", "Infosys Limited", "Self-service portal", "In progress", 1200000, "David Brown"),
  makeRecord("projects", "CRM rollout", "Wipro Technologies", "Sales platform rollout", "Completed", 640000, "Emily Davis"),
  makeRecord("tasks", "Prepare proposal", "Tata Consultancy Services", "Cloud migration proposal", "Due today", 0, "John Smith"),
  makeRecord("tasks", "Review campaign", "Infosys Limited", "Review Q4 campaign metrics", "In progress", 0, "Sarah Wilson"),
  makeRecord("tasks", "Follow up with client", "Tech Mahindra", "Schedule analytics demo", "Pending", 0, "Michael Scott"),
  makeRecord("calendar", "Client meeting", "Tata Consultancy Services", "Account review", "Today", 0, "John Smith"),
  makeRecord("calendar", "Project review", "Website Revamp", "Design approval", "Tomorrow", 0, "Sarah Wilson"),
  makeRecord("calendar", "Team standup", "Development team", "Weekly team sync", "Tomorrow", 0, "David Brown"),
  makeRecord("employees", "Emily Davis", "Sales", "Account executive", "Available", 0, "Sales"),
  makeRecord("employees", "Michael Scott", "Sales", "Sales manager", "Available", 0, "Sales"),
  makeRecord("employees", "Sarah Wilson", "Projects", "Project manager", "Available", 0, "Projects"),
  makeRecord("tickets", "Login issue", "Tata Consultancy Services", "Unable to access account", "Open", 0, "Emily Davis"),
  makeRecord("tickets", "Billing question", "Infosys Limited", "Invoice clarification", "In progress", 0, "Michael Scott"),
  makeRecord("tickets", "Export request", "Wipro Technologies", "Request for data export", "Open", 0, "Sarah Wilson"),
];

fs.mkdirSync(dataDirectory, { recursive: true });
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify(initialRecords, null, 2));
}
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, "[]");
}
if (!fs.existsSync(secretFile)) {
  fs.writeFileSync(secretFile, crypto.randomBytes(48).toString("hex"), { mode: 0o600 });
}

const tokenSecret = fs.readFileSync(secretFile, "utf8").trim();
if (!tokenSecret) {
  throw new Error("Authentication secret file is empty.");
}

function readRecords() {
  const records = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  if (!Array.isArray(records)) {
    throw new Error("CRM data file must contain a JSON array.");
  }
  return records;
}

function writeRecords(records) {
  fs.writeFileSync(dataFile, JSON.stringify(records, null, 2));
}

function readUsers() {
  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
  if (!Array.isArray(users)) {
    throw new Error("User data file must contain a JSON array.");
  }
  return users;
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function createToken(user) {
  return jwt.sign({ sub: user.id }, tokenSecret, { expiresIn: "7d" });
}

function requireAuth(req, res, next) {
  const authorization = req.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Sign in to access your workspace." });
  }

  try {
    const payload = jwt.verify(token, tokenSecret);
    const user = readUsers().find((item) => item.id === payload.sub);
    if (!user) {
      return res.status(401).json({ error: "Your session is no longer valid. Please sign in again." });
    }
    req.user = publicUser(user);
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Your session has expired. Please sign in again." });
    }
    return next(error);
  }
}

function seedUserRecords(userId) {
  const records = readRecords();
  const templates = records.filter((record) => record.isTemplate);
  const ownedRecords = records.filter((record) => record.userId === userId);
  if (!ownedRecords.length && templates.length) {
    const copy = templates.map(({ isTemplate, ...record }) => ({
      ...record,
      id: crypto.randomUUID(),
      userId,
      updatedAt: new Date().toISOString(),
    }));
    writeRecords([...copy, ...records]);
  }
}

const existingRecords = readRecords();
if (existingRecords.some((record) => !record.userId && !record.isTemplate)) {
  writeRecords(existingRecords.map((record) =>
    !record.userId ? { ...record, isTemplate: true } : record,
  ));
}

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (_req, res) => {
  res.send("CEO Vision Backend Running Successfully");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "CEO Vision API" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 80) {
    return res.status(400).json({ error: "Enter your name (2–80 characters)." });
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8 || password.length > 128) {
    return res.status(400).json({ error: "Your password must be between 8 and 128 characters." });
  }

  const users = readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ error: "An account with this email already exists. Please sign in." });
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, user]);
  seedUserRecords(user.id);
  res.status(201).json({ token: createToken(user), user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your email and password." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = readUsers().find((item) => item.email === normalizedEmail);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "The email or password is incorrect." });
  }
  res.json({ token: createToken(user), user: publicUser(user) });
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.use("/api/records", requireAuth);

app.get("/api/records", (req, res) => {
  const { type } = req.query;
  if (type && !recordTypes.includes(type)) {
    return res.status(400).json({ error: "Unknown record type." });
  }
  const records = readRecords().filter((record) => record.userId === req.user.id);
  res.json(type ? records.filter((record) => record.type === type) : records);
});

app.post("/api/records", (req, res) => {
  const { type, name, company = "", detail = "", status = "New", owner = "", value = 0 } = req.body;
  const numericValue = Number(value);
  if (!recordTypes.includes(type)) {
    return res.status(400).json({ error: "Choose a valid record type." });
  }
  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "A name is required." });
  }
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return res.status(400).json({ error: "Value must be a non-negative number." });
  }

  const record = {
    id: crypto.randomUUID(),
    type,
    name: name.trim(),
    company: typeof company === "string" ? company.trim() : "",
    detail: typeof detail === "string" ? detail.trim() : "",
    status: typeof status === "string" && status.trim() ? status.trim() : "New",
    value: numericValue,
    owner: typeof owner === "string" ? owner.trim() : "",
    userId: req.user.id,
    updatedAt: new Date().toISOString(),
  };
  const records = readRecords();
  records.unshift(record);
  writeRecords(records);
  res.status(201).json(record);
});

app.patch("/api/records/:id", (req, res) => {
  const { status } = req.body;
  if (typeof status !== "string" || !status.trim()) {
    return res.status(400).json({ error: "A non-empty status is required." });
  }
  const records = readRecords();
  const record = records.find((item) => item.id === req.params.id && item.userId === req.user.id);
  if (!record) {
    return res.status(404).json({ error: "Record not found." });
  }
  record.status = status.trim();
  record.updatedAt = new Date().toISOString();
  writeRecords(records);
  res.json(record);
});

app.delete("/api/records/:id", (req, res) => {
  const records = readRecords();
  const remainingRecords = records.filter((record) => record.id !== req.params.id || record.userId !== req.user.id);
  if (remainingRecords.length === records.length) {
    return res.status(404).json({ error: "Record not found." });
  }
  writeRecords(remainingRecords);
  res.status(204).end();
});

app.use((err, _req, res, _next) => {
  console.error("API request failed:", err);
  res.status(500).json({ error: "The server could not complete the request." });
});

app.listen(PORT, () => {
  console.log(`CEO Vision API listening at http://localhost:${PORT}`);
});

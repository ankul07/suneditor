import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";

// ES6 modules mein __dirname manually banana padta hai
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(passport.initialize());

// Static files serve karne ke liye (frontend ke liye)
app.use(express.static(path.join(__dirname, "../../client/dist")));

app.get("/api", (req, res) => {
  res.json({ message: "Backend Running Successfully!" });
});

// Routes import
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blogs.route.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);

// Catch-all handler for frontend routes (SPA ke liye)
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  }
});

app.use(globalErrorHandler);

export default app;

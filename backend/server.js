const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { connectDB } = require("./config/db");
// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to database and initialize tables
connectDB().then(() => {
  // Import the initDB function to create tables
  const { initDB } = require("./config/db");
  initDB()
    .then(() => console.log("Database tables initialized"))
    .catch((err) => console.error("Error initializing tables:", err));
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Customize Helmet's security settings to allow cross-origin images
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          "https://*.unsplash.com",
          "https://ik.imagekit.io",
          "https://*.imagekit.io",
          "https://ik.imagekit.io/",
          "https://images.unsplash.com",
          "*",
        ],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "https://ik.imagekit.io",
          "https://*.imagekit.io",
        ],
      },
    },
  })
);

app.use(compression()); // Compress responses

// Logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Define routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/causes", require("./routes/causeRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/categories", require("./routes/adminCategoryRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/chatbot", require("./routes/chatbotRoutes"));

// Serve uploads as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "build", "index.html"));
  });
}

// Import and use error middleware
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Route not found handler - must be after all routes
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// For testing purposes
module.exports = app;

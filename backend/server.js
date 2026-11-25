
const path = require("path");

//Load the .env file from the project root directory
require("dotenv").config({
    path: path.resolve(__dirname, "../.env"),
});


const express = require("express");
const cors = require("cors");

const db = require("./src/config/db"); //Establishes a MySQL connection
const authRoutes = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Middleware
app.use(cors());
app.use(express.json());

//Register authentication routes
app.use("/api/auth", authRoutes); ///api/auth will serve as a base path (prefix)

// Test the main API endpoint.
app.get("/", (req, res) => {
    res.json({
        message: "ShelfBeez API is running!"
    });
});

// Test database connection
app.get("/api/test-db", async (req, res) => { 
    try {
        const [result] = await db.query("SELECT 1 AS result");

        res.json({
            message: "MySQL connection successful!",
            data: result
        });

    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            message: "Database connection failed."
        });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

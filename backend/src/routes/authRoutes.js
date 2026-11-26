
const express = require("express"); //import Express

const router = express.Router(); //router allows to define API addresses in a separate file

const authController = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");


// Register a new user
router.post("/register", authController.register);
//router.post: Expects an HTTP POST request
//"/register": Specifies the address of the endpoint
//authController.register: The function that is executed when a request is received

// Login an existing user
router.post("/login", authController.login);

// Get the authenticated user's profile.
router.get(
    "/profile",
    authenticateToken,
    authController.getProfile
);

// Update the authenticated user's profile.
router.put(
    "/profile",
    authenticateToken,
    authController.updateProfile
);

module.exports = router; //exporting the router
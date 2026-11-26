
const express = require("express"); //import Express

const router = express.Router(); //router allows to define API addresses in a separate file

const authController = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const upload = require("../config/upload");

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

// Upload the authenticated user's profile picture.
router.post(
    "/profile/avatar", //Sends the photo
    authenticateToken, //Verifies that the user is logged in
    upload.single("avatar"), //Saves the photo to the server
    authController.uploadAvatar //Saves the photo path to MySQL
);

// Remove the authenticated user's profile picture.
router.delete(
    "/profile/avatar",
    authenticateToken,
    authController.removeAvatar
);



module.exports = router; //exporting the router

const express = require("express"); //import Express

const router = express.Router(); //router allows to define API addresses in a separate file

const authController = require("../controllers/authController");

// Register a new user
router.post("/register", authController.register);
//router.post: Expects an HTTP POST request
//"/register": Specifies the address of the endpoint
//authController.register: The function that is executed when a request is received

module.exports = router; //exporting the router
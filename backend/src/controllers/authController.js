
const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");
const jwt = require("jsonwebtoken");

// Register a new user.
async function register(req, res) {

    try {
        // Get user information from the request body.
        const { username, email, password, name } = req.body;

        // Check if all required fields are provided.
        if (!username || !email || !password || !name) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        // Normalize user input.
        const normalizedUsername = username.trim();
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();

        // Validate input values.
        if (!normalizedUsername || !normalizedEmail || !normalizedName) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long."
            });
        }

        // Check whether the email or username is already registered.
        const existingUser = await authModel.findUserByEmailOrUsername(
            normalizedEmail,
            normalizedUsername
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                message: "Email or username is already in use."
            });
        }

        // Hash the password before storing it.
        const passwordHash = await bcrypt.hash(password, 10); //bcrypt.hash() converts a password into a hash value.
        //10 is the salt rounds value; it determines the computational cost of the hashing process.

        // Save the new user in the database.
        const userId = await authModel.createUser(
            normalizedUsername,
            normalizedEmail,
            passwordHash,
            normalizedName
        );

        // Send a successful response.
        return res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: userId,
                username: normalizedUsername,
                email: normalizedEmail,
                name: normalizedName
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred during registration.",
            debug: error.code || error.message
        });
    }
}

// Login an existing user
async function login(req, res) {
    try {
        // Get login information from the request body.
        const { identifier, password } = req.body;

        // Check whether all required fields are provided.
        if (!identifier || !password) {
            return res.status(400).json({
                message: "Username/email and password are required."
            });
        }

        // Normalize user input
        const normalizedIdentifier = identifier.trim().toLowerCase();

        // Find the user in the database.
        const user = await authModel.findUserByLogin(
            normalizedIdentifier
        );

        // Check whether the user exists.
        if (!user) {
            return res.status(401).json({
                message: "Invalid username/email or password."
            });
        }

        // Compare the entered password with the stored hash.
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        // Check whether the password is correct.
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username/email or password."
            });
        }

        // Generate a JWT token.
        const token = jwt.sign(
       {
        id: user.id //It places the user ID into the token
       },
        process.env.JWT_SECRET, //It uses the secret key to sign the token
       {
        expiresIn: "1h" //Ensures the token is valid for 1 hour.
       }
);

        // Send a successful response.
        return res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "An error occurred during login."
        });
    }
}


async function getProfile(req, res) {
    try {
        // Get the user ID from the verified JWT.
        //controller can access the user ID contained within the verified token
        const userId = req.user.id;

        // Find the user in the database.
        const user = await authModel.findUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json({
            message: "Profile retrieved successfully!",
            user: user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "An error occurred while retrieving the profile."
        });
    }
}


async function updateProfile(req, res) {
    try {
        // Get the authenticated user's ID.
        const userId = req.user.id;

        // Get the updated profile information.
        const { name, username, bio } = req.body;

        // Validate required fields.
        if (!name || !username) {
            return res.status(400).json({
                message: "Name and username are required."
            });
        }

        // Update the user's profile in the database.
        await authModel.updateUserProfile(
            userId,
            name.trim(),
            username.trim().toLowerCase(),
            bio ? bio.trim() : ""
        );

        // Retrieve the updated profile.
        const updatedUser = await authModel.findUserById(userId);

        return res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser
        });

    } catch (error) {
        // Handle duplicate usernames.
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "This username is already taken."
            });
        }

        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "An error occurred while updating the profile."
        });
    }
}

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};

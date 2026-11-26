
const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    // Get the Authorization header.
    const authHeader = req.headers.authorization;
    

    // Extract the token.
    const [scheme, token] = authHeader
        ? authHeader.split(" ")
        : [];

    // Check whether the token exists.
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Access token is required."
        });
    }

    try {
        // Verify the token.
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Attach the decoded user information to the request.
        req.user = decoded;

        // Continue to the next middleware or route.
        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token."
        });
    }
}

module.exports = authenticateToken;

const db = require("../config/db"); //using the MySQL connection pool from the `db.js` file created earlier

//find a user by email or username
async function findUserByEmailOrUsername(email, username) {
    const [rows] = await db.query(
        "SELECT id, username, email FROM users WHERE email = ? OR username = ?",
        [email, username]
    );
     
    return rows;
}

//create a new user
async function createUser(username, email, passwordHash, name) {
    const [result] = await db.query(
        "INSERT INTO users (username, email, password_hash, name) VALUES (?, ?, ?, ?)",
        [username, email, passwordHash, name]
    );

    return result.insertId;
}

// Find a user by email or username for login.
async function findUserByLogin(identifier) {
    const [rows] = await db.query(
        `SELECT id, username, email, password_hash, name
         FROM users
         WHERE email = ? OR username = ?
         LIMIT 1`,
        [identifier, identifier]
    );

    return rows[0];
}


// Find a user by ID.
async function findUserById(userId) { //user ID that we will obtain from the JWT
    const [rows] = await db.query(
        `SELECT id, username, email, name, bio, avatar_url, created_at
         FROM users
         WHERE id = ?
         LIMIT 1`,
        [userId]
    );

    return rows[0]; //Returns the found user. If the user is not found, it becomes undefined.
}


async function updateUserProfile(userId, name, username, bio) {
    const [result] = await db.query(
        `UPDATE users
         SET name = ?, username = ?, bio = ?
         WHERE id = ?`,
        [name, username, bio, userId]
    );

    return result.affectedRows;
}

module.exports = {
    findUserByEmailOrUsername,
    createUser,
    findUserByLogin,
    findUserById,
    updateUserProfile
};
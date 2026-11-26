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

module.exports = {
    findUserByEmailOrUsername,
    createUser,
    findUserByLogin
};
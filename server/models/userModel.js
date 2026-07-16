const db = require("../database/db");
function createUser(user, callback) {
    const sql = `
        INSERT INTO users
        (username, password)
        VALUES (?, ?)
    `;
    db.query(
        sql,
        [
            user.username,
            user.password
        ],
        callback
    );
}

function getUserByUsername(username, callback) {
    const sql = `
        SELECT *
        FROM users
        WHERE username = ?
    `;
    db.query(
        sql,
        [username],
        callback
    );
}

module.exports = {
    createUser,
    getUserByUsername
};
const db = require("../database/db");

function getAllTodos(userId, callback) {
    const sql = `
        SELECT
            id,
            title,
            completed,
            due_date,
            created_at
        FROM todos
        WHERE user_id = ?
        ORDER BY due_date ASC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
}

function createTodo(todo, callback) {
    const sql = `
        INSERT INTO todos
        (title, completed, due_date, user_id)
        VALUES (?, ?, ?, ?)
    `;

    const values = [
        todo.title,
        todo.completed,
        todo.due_date,
        todo.user_id
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
}

function updateTodo(id, userId, todo, callback) {
    const sql = `
        UPDATE todos
        SET
            title = ?,
            completed = ?,
            due_date = ?
        WHERE id = ?
        AND user_id = ?
    `;

    const values = [
        todo.title,
        todo.completed,
        todo.due_date,
        id,
        userId
    ];

    db.query(sql, values, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
}

function deleteTodo(id, userId, callback) {
    const sql = `
        DELETE FROM todos
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, userId], (err, results) => {
        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
}

function patchTodo(id, userId, updates, callback) {
    const sql = `
        UPDATE todos
        SET
            title = ?,
            due_date = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            updates.title,
            updates.due_date,
            id,
            userId
        ],
        (err, results) => {
            if (err) {
                return callback(err, null);
            }

            callback(null, results);
        }
    );
}

module.exports = {
    getAllTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    patchTodo
};
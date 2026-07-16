const todoModel = require("../models/todoModel");

function getTodos(req, res) {
    todoModel.getAllTodos(req.user.id, (err, todos) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch todos."
            });
        }

        res.status(200).json({
            success: true,
            count: todos.length,
            data: todos
        });
    });
}

function createTodo(req, res) {
    const {
        title,
        completed,
        due_date
    } = req.body;

    if (!title || !due_date) {
        return res.status(400).json({
            success: false,
            message: "Title and due date are required."
        });
    }

    const todo = {
        title,
        completed: completed || false,
        due_date,
        user_id: req.user.id
    };

    todoModel.createTodo(todo, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to create todo."
            });
        }

        res.status(201).json({
            success: true,
            message: "Todo created successfully.",
            id: results.insertId
        });
    });
}

function updateTodo(req, res) {
    const id = req.params.id;

    const {
        title,
        completed,
        due_date
    } = req.body;

    if (!title || !due_date) {
        return res.status(400).json({
            success: false,
            message: "Title and due date are required."
        });
    }

    const todo = {
        title,
        completed,
        due_date
    };

    todoModel.updateTodo(
        id,
        req.user.id,
        todo,
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to update todo."
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found."
                });
            }

            res.status(200).json({
                success: true,
                message: "Todo updated successfully."
            });

        }
    );
}

function deleteTodo(req, res) {
    const id = req.params.id;

    todoModel.deleteTodo(
        id,
        req.user.id,
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete todo."
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found."
                });
            }

            res.status(200).json({
                success: true,
                message: "Todo deleted successfully."
            });

        }
    );
}

function patchTodo(req, res) {
    const id = req.params.id;

    const {
        title,
        due_date
    } = req.body;

    if (!title || !due_date) {
        return res.status(400).json({
            success: false,
            message: "Title and due date are required."
        });
    }

    todoModel.patchTodo(
        id,
        req.user.id,
        {
            title,
            due_date
        },
        (err, results) => {

            if (err) {
                console.error(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to edit todo."
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Todo not found."
                });
            }

            res.status(200).json({
                success: true,
                message: "Todo updated successfully."
            });

        }
    );
}

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    patchTodo
};
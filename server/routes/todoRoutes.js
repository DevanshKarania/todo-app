const {getTodos, createTodo, updateTodo, deleteTodo, patchTodo} = require("../controllers/todoController");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id", patchTodo);

module.exports = router;
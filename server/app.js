require("dotenv").config();
require("./database/db");

const express = require("express");
const cors = require("cors");
const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://todo-app-nu-murex-99.vercel.app/"
    ],
    credentials: true
}));

app.use(express.json());
app.use("/todos", todoRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Todo API is running!"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
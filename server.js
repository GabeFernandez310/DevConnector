const express = require("express");
const connectDB = require("./config/db");

const app = express();

//Create Database connection
connectDB();

//Init middleware which is required to access
//body of request in users.js
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

//define routes
app.use("/api/users", require("./routes/api/users")); //first arg is path shown in url from start file, second arg is actual file path relative to start file
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

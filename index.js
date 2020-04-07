const express = require("express");

const postRouter = require("./posts/postRouter.js"); 

const server = express();

server.use(express.json());

server.use("/api/posts", postRouter); 

server.get("/", (req, res) => {
  res.send("API is running.....");
});

server.listen(5000, () => {
  console.log('Server Running on http://localhost:5000');
});
const express = require("express");
const server = express();
const port = 8000;
const postsRouter = require("./posts-router.js");
const commentsRouter = require("./comments-router.js");

server.use(express.json());
server.use("/api/posts", postsRouter);
server.use("/api/comments", commentsRouter);

server.listen(port, () => console.log(`server listening on port ${port}`));

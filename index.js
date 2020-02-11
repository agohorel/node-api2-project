const express = require("express");
const cors = require("cors");
const server = express();
const port = 8000;
const postsRouter = require("./posts-router.js");

server.use(express.json());
server.use(cors());
server.use("/api/posts", postsRouter);

server.listen(port, () => console.log(`server listening on port ${port}`));

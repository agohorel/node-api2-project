const express = require("express");
const router = express.Router();
const db = require("./data/db");

router.post("/", async (req, res) => {
  const { body } = req;

  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }

  try {
    const { id } = await db.insert(body);
    const newPost = await db.findById(id);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({
      error: "There was an error while saving the post to the database"
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  const {
    body,
    params: { id }
  } = req;

  try {
    const post = await db.findById(id);

    if (!post.length) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }

    if (!body.text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    }

    const comment = { ...body, post_id: id };
    const commentID = await db.insertComment(comment);
    const newComment = await db.findCommentById(commentID.id);
    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "There was an error while saving the comment to the database."
      });
  }
});

module.exports = router;

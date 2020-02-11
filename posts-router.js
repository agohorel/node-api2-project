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
    res.status(500).json({
      error: "There was an error while saving the comment to the database."
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post's information could not be retrieved." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);

    if (!post.length) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }

    res.status(200).json(post);
  } catch (err) {
    res
      .status(500)
      .json({ error: "The post information could not be retrieved." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await db.remove(id);
    if (!deletedItem) {
      res
        .status(404)
        .json({ message: "The psot with the specified ID does not exist" });
    }

    res.status(200).send("successfully deleted comment");
  } catch (error) {
    res.status(500).json({ error: "The post could not be removed" });
  }
});

router.put("/:id", async (req, res) => {
  const {
    body,
    params: { id }
  } = req;

  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide a title and contents for the post."
    });
  }

  try {
    const updatedItem = await db.update(id, body);
    if (!updatedItem) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    }

    const updatedPost = await db.findById(id);
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "The post information could not be modified." });
  }
});

module.exports = router;

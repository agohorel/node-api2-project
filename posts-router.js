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

module.exports = router;

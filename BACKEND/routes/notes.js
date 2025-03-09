const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
var fetchuser = require("../middleware/fetchuser");

// Route 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 2: Add a new note using: POST "/api/notes/addnote"
router.post('/addnote', fetchuser, [
  body('title', 'Title must be at least 3 characters long').isLength({ min: 3 }),
  body('description', 'Description must be at least 5 characters long').isLength({ min: 5 }),
  body('tag', 'Tag must be at least 3 characters long').isLength({ min: 3 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, tag } = req.body;
    console.log("Request body:", req.body);

    
    // Create a new note
    const note = new Note({
      user: req.user.id,
      title,
      description,
      tag
    });
    await note.save();
    res.json({ message: "Note added successfully", note });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Note with this title already exists" });
    }
    console.error("Error adding note:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 3: Update an existing note using: PUT "/api/notes/updatenote/:id". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  const newNote = {};
  if (title) { newNote.title = title; }
  if (description) { newNote.description = description; }
  if (tag) { newNote.tag = tag; }

  try {
    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found"); }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Route 4: Delete an existing note using: DELETE "/api/notes/deletenote/:id". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found"); }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully", note });
  } catch (error) {
    console.error("Error deleting note:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
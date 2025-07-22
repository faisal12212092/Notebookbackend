const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser')
const Notes = require('../MongoSchema/notes')
const { body, validationResult } = require("express-validator");


// ROUTE 1: Get All the Notes using GET "/api/notes/getsner". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
const usernotes = await Notes.find({user: req.user.id})
res.json(usernotes)
})


//Route2(add notes)

router.post('/addnotes', fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    
  // if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { title, description, tag } = req.body;
const note = new Notes({
  title,
  description,
  tag,
  user: req.user.id
});
  const savedNote = await note.save();
  res.json(savedNote);
});




// ROUTE 3: Update an existing Note using: POST /api/auth/updatenote'. Login requir
router.put('/updatenote/:id', fetchuser, async (req, res) => {
const { title, description, tag } = req.body;

// Create a newNote object
const newNote = {};
if (title) newNote.title = title;
if (description) newNote.description = description;
if (tag) newNote.tag = tag;

// Find the note to be updated and update it
let note = await Notes.findById(req.params.id);
if (!note) return res.status(404).send("Not Found");

if (note.user.toString() !== req.user.id) return res.status(401).send("Not Allowed");

note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
res.json({note});
});




// ROUTE 4: delete an existing Note using: POST /api/auth/updatenote'. Login requir
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id); // <-- FIXED
    if (!note) return res.status(404).json({ error: "Note not found" });
    if (note.user.toString() !== req.user.id)
      return res.status(401).json({ error: "Not allowed" });
    await Notes.findByIdAndDelete(req.params.id); // <-- FIXED
    res.json({ success: "Note deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports=router;
const express = require("express");
const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE NOTE
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content } = req.body;
        const { userId, name } = req.user;

        if (!title || !content) {
            return res.status(400).json({ message: "All fields required" });
        }

        const note = new Note({
            title,
            content,
            user: userId,
            userName: name
        });

        await note.save();
        res.status(201).json(note);
    } catch {
        res.status(500).json({ message: "Failed to create note" });
    }
});

// GET NOTES (important first, newest first)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.userId })
            .sort({ isImportant: -1, createdAt: -1 });

        res.json(notes);
    } catch {
        res.status(500).json({ message: "Failed to fetch notes" });
    }
});

// TOGGLE IMPORTANT ⭐
router.patch("/:noteId/important", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOne({
            _id: req.params.noteId,
            user: req.user.userId
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        note.isImportant = !note.isImportant;
        await note.save();

        res.json(note);
    } catch {
        res.status(500).json({ message: "Failed to update note" });
    }
});

// DELETE NOTE
router.delete("/:noteId", authMiddleware, async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.noteId,
            user: req.user.userId
        });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note deleted" });
    } catch {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;

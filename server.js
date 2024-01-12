
// All required modules 
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Defining the port for local and Heroku 
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Port activation confirmation 
app.listen(PORT, () => {
  console.log(`App listening at ${PORT}`)
});

// Serve up the notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/notes.html"))
);

// Serve up the homepage 
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// read current notes stored on server 
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    res.json(JSON.parse(data));
  });
});

// Funtion to add new notes 
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(newNote);
    });
  });
});

// Functions to delete notes from the server 
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json({ message: "Note deleted successfully" });
    });
  });
});

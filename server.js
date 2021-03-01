const express = require('express');
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path');
const { notes } = require('./db/db.json');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//function start
function createNewNote(body, noteArray) {
    let note = body;
    noteArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: noteArray }, null, 2)
    );
    return note;
}

function findById(id, noteArray) {
    const result = noteArray.filter(note => note.id === id)[0];
    return result;
}

function deleteNote(id, noteArray) {
    //to return index
    const itemToRemoveIndex = noteArray.findIndex(function(notes) {
        return notes.id === id;
    });
      
    // proceed to remove an item only if it exists.
    if(itemToRemoveIndex !== -1){
        noteArray.splice(itemToRemoveIndex, 1);
    }
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: noteArray }, null, 2)
    );
    return noteArray;
}
//function end

// route start
// for /api/
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
    let result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// app.get for html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

//app.post
app.post('/api/notes', (req, res) => {
    req.body.id = uniqid();
    console.log(req.body)
    let note = createNewNote(req.body, notes)
    res.json(note);
});

//app.delete
app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    let result = deleteNote(req.params.id, notes);
    res.json(result);
});

//route end

//app listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
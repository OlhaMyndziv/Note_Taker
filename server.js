const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

// Express App
var app = express();
var PORT = process.env.PORT || 3000;

// Link to assets
app.use(express.static('public'));


// This is required for API calls,format data as JSON.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Start with index.html. First get it and then listen.
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// url
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})


// GET, POST, DELETE API Endpoints.


// GET and POST functions 
app.route("/api/notes")
    .get(function (req, res) {
        res.json(database);
    })

    // Add a new note to the json db file.
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let highestId = 99;
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                highestId = individualNote.id;
            }
        }
        // This assigns an ID to the newNote. 
        newNote.id = highestId + 1;
        // We push it to db.json.
        database.push(newNote)

        // Write the db.json file again.
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Note was saved!");
        });
        res.json(newNote);
    });


// Delete a note based on an ID 

app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    for (let i = 0; i < database.length; i++) {
        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Note was deleted!");
        }
    });
    res.json(database);
});


// Listening is the last thing Express should do.

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
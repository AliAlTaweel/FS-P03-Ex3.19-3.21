require("dotenv").config(); // Ensure this is called as a function
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors"); // Uncomment this to use CORS
const newPerson = require("./models/phonebook");
const phonebook = require("./models/phonebook");

const app = express();
const PORT = process.env.VITE_PORT || 3003;

app.use(express.static("dist"));
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Enable CORS for all routes
app.use(morgan("tiny")); // Use morgan logging middleware for requests

// Get all persons
app.get("/api/persons", (req, res) => {
  newPerson
    .find({})
    .then((persons) => {
      res.json(persons);
    })
    .catch((error) => {
      res.status(500).json({ error: "Could not retrieve persons" });
    });
});

// Get info about all persons
app.get("/api/info", async (req, res) => {
  const persons = await Note.find({});
  res.send(
    `persons has info for ${persons.length} persons <br/><br/>${new Date()}.`
  );
});

// ============ Get Person by ID ==========
app.get("/api/persons/:id", (req, res) => {
  newPerson
    .findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ error: "No such note!" });
      }
    })
    .catch((error) => res.status(400).json({ error: "Malformatted ID" }));
});

// ========= Delete person by ID ============
app.delete("/api/persons/:id", (req, res, next) => {
  newPerson
    .findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

// Generate a new ID
const generateId = () => {
  const maxId = Note.length > 0 ? Math.max(...Note.map((note) => note.id)) : 0;
  return maxId + 1;
};

// =========== Create a new Person ==========
app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required!" });
  }

  const newNum = new newPerson({
    name,
    number,
  });

  newNum
    .save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => res.status(400).json({ error: "Error saving person" }));
});
// ========== Update already Person =============
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  newPerson
    .findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatePerson) => {
      res.json(updatePerson);
    })
    .catch((error) => next(error));
});

// ============ unknownEndpoint ===============
const unknownEndpoint = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};
// ============ error Handler =================
const errorHandler = (error, req, res, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id4" });
  }
  next(error);
};
app.use(unknownEndpoint);
app.use(errorHandler);
// =========== Start the server ==============
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

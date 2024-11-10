const mongoose = require("mongoose");
require("dotenv").config();
mongoose.set("strictQuery", false);

const url = process.env.MONBODB_URI;
  

console.log("connecting to", url);

mongoose
  .connect(url)

  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });
  const phoneNumberValidator = (value) => {
    // Regex to check phone number format (e.g., 09-1234567 or 040-1234567)
    const regex = /^[0-9]{2,3}-[0-9]{6,9}$/;
    return regex.test(value);
  };
const phonebookSchema = new mongoose.Schema({
  "name": {
    type:String,
    minLength: 3,
    require:true
  },
  "number": {
    type: String,
    required: true,
    validate: {
      validator: phoneNumberValidator, // Custom validator
      message: 'Phone number must be in the format: XX-XXXXXXX or XXX-XXXXXXXX.',
    },
    minlength: 8, // Phone number should have at least 8 characters
  },
});

phonebookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("phonebook", phonebookSchema,"pb1");
// Importing required modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Creating an instance of Express
const app = express();

// Middleware setup
app.use(bodyParser.json()); // Parses incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parses incoming URL-encoded requests
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(morgan('dev')); // Logs HTTP requests

// Basic route for testing the server
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Sample route for handling API requests
app.get('/api/gemini',async (req, res) => {
    let model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        // Set the `responseMimeType` to output JSON
        // generationConfig: { responseMimeType: "application/json" }
      });
      
      let prompt = `Create 5 Units related to topic Javascript and each unit should have lesson object as well
       using this JSON schema:
        { \"type\": \"object\", \"properties\": { \"Unit Name\": { \"type\": \"string\" } }., \"properties\": { \"expected completion hours\": { \"type\": \"integer\" } }, \"properties\": { \"description\": { \"type\": \"string\" } }, \"properties\": { \"option3\": { \"type\": \"string\" } }, \"properties\": { \"correctOption\": { \"type\": \"Option1,2,3\" } } }`;
      
      let result = await model.generateContent(prompt)
      let data = result.response.candidates[0].content.parts[0].text
      console.log(result.response.text());
  res.json({ message: 'This is an example endpoint!',data });
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

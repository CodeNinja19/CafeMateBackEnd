
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { FunctionDeclarationSchemaType }=require("@google/generative-ai");
require("dotenv").config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.google_api_key);

// Combine this line with any other imports you have from @google/generative-ai


// Using `responseSchema` requires one of the Gemini 1.5 Pro models
let AskQuestion = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  // Set the `responseMimeType` to output JSON
  // Pass the schema object to the `responseSchema` field
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          answer: {
            type: FunctionDeclarationSchemaType.STRING,
          },
      },
    },
  }
});

module.exports=AskQuestion;

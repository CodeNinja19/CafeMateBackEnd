
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { FunctionDeclarationSchemaType }=require("@google/generative-ai");
require("dotenv").config();

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.google_api_key);

// Combine this line with any other imports you have from @google/generative-ai


// Using `responseSchema` requires one of the Gemini 1.5 Pro models
let gemini = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  // Set the `responseMimeType` to output JSON
  // Pass the schema object to the `responseSchema` field
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: FunctionDeclarationSchemaType.ARRAY,
      items: {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: {
          recipe_name: {
            type: FunctionDeclarationSchemaType.STRING,
          },
        },
      },
    },
  }
});

module.exports=gemini;



// let ask = {
//   contents: [
//       {
//           parts: [
//               {
//                   text: "tell me about biscuits"
//               }
//           ],
//           role: "user"
//       },
//       {
//           parts: [
//               {
//                   text: "A biscuit is a small, typically round baked good. They can be sweet or savory, and their ingredients and preparation methods vary widely around the world. \n\nHere's some more information about biscuits:\n\n**Types:**\n* **Buttermilk biscuits:** These are a classic Southern U.S. biscuit, known for their fluffy texture and slightly tangy flavor. They're made with, well, buttermilk, which reacts with the baking powder to create air bubbles.\n* **Drop biscuits:** These are a simpler type of biscuit that doesn't require any rolling or cutting. The dough is simply dropped by spoonfuls onto a baking sheet.\n* **Scones:** Though technically not a biscuit, scones are very similar. They're often sweeter and richer than biscuits, and may include ingredients like dried fruit, nuts, or chocolate chips.\n* **Shortcakes:** These are a type of biscuit popular in the United Kingdom. They're typically made with a combination of butter, sugar, and flour, and are often served with jam and clotted cream.\n\n**Ingredients:**\nCommon biscuit ingredients include flour, baking powder or baking soda, salt, butter or shortening, and milk or buttermilk. Sweet biscuits may also include sugar, eggs, and flavorings like vanilla extract. \n\n**Serving Suggestions:**\n* **Savory:** Serve with butter, jam, honey, gravy, sausage, eggs, or fried chicken. \n* **Sweet:** Enjoy with fruit, whipped cream, chocolate sauce, or ice cream.\n\n**Tips for Making Biscuits:**\n* Use cold ingredients for the flakiest biscuits.\n* Don't overmix the dough, or the biscuits will be tough.\n* Bake biscuits in a preheated oven until they're golden brown."
//               }
//           ],
//           role: "model"
//       },
//       {
//           parts: [
//               {
//                   text: "tell me more on this topic"
//               }
//           ],
//           role: "user"
//       }
//   ]

// }
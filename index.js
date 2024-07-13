const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const AppError = require("./Utilities/AppError.js");
const cookieParser = require("cookie-parser");
const login = require("./routes/login.js");
const fetchData = require("./routes/fetchData.js")
const AllCafe = require("./models/AllCafe.js");
const gemini = require("./gemini/model.js");
const AskQuestion = require("./gemini/AskQuestion.js");
const chatWithAi=require("./routes/chatWithAi.js");
const postReview=require("./routes/postReview.js");


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/cafes');
}


const testing = async function () {
    const data = await AllCafe.findOne({ cafeName: "# Momo" });
    console.log(data);
}
// testing();
// app.use section

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());



app.get("/api", (req, res) => {
    res.status(200).json({ message: "welcome back it has been a long time!!!" });
})


app.use("/api", login);
app.use("/api", fetchData);
app.use("/api",chatWithAi);
app.use("/api",postReview);

let prompt = "tell me about biscuits";

let ask = {
    contents: [
        {
            parts: [
                {
                    text: "tell me about biscuits"
                }
            ],
            role: "user"
        },
        {
            parts: [
                {
                    text: "A biscuit is a small, typically round baked good. They can be sweet or savory, and their ingredients and preparation methods vary widely around the world. \n\nHere's some more information about biscuits:\n\n**Types:**\n* **Buttermilk biscuits:** These are a classic Southern U.S. biscuit, known for their fluffy texture and slightly tangy flavor. They're made with, well, buttermilk, which reacts with the baking powder to create air bubbles.\n* **Drop biscuits:** These are a simpler type of biscuit that doesn't require any rolling or cutting. The dough is simply dropped by spoonfuls onto a baking sheet.\n* **Scones:** Though technically not a biscuit, scones are very similar. They're often sweeter and richer than biscuits, and may include ingredients like dried fruit, nuts, or chocolate chips.\n* **Shortcakes:** These are a type of biscuit popular in the United Kingdom. They're typically made with a combination of butter, sugar, and flour, and are often served with jam and clotted cream.\n\n**Ingredients:**\nCommon biscuit ingredients include flour, baking powder or baking soda, salt, butter or shortening, and milk or buttermilk. Sweet biscuits may also include sugar, eggs, and flavorings like vanilla extract. \n\n**Serving Suggestions:**\n* **Savory:** Serve with butter, jam, honey, gravy, sausage, eggs, or fried chicken. \n* **Sweet:** Enjoy with fruit, whipped cream, chocolate sauce, or ice cream.\n\n**Tips for Making Biscuits:**\n* Use cold ingredients for the flakiest biscuits.\n* Don't overmix the dough, or the biscuits will be tough.\n* Bake biscuits in a preheated oven until they're golden brown."
                }
            ],
            role: "model"
        },
        {
            parts: [
                {
                    text: "tell me more on this topic"
                }
            ],
            role: "user"
        }
    ]

}

async function called(prompt) {
    let request = await AskQuestion.generateContent(prompt);
    console.log(request.response.text());
}


// called(ask);

app.use((err, req, res, next) => {
    const { status, message } = err;
    console.log(err);
    res.json({ message });

})
app.listen("4000", () => {
    console.log("All good");
})
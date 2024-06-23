const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const AllCafe = require('../models/AllCafe.js'); // Adjust the path as needed
const Cafe=require("../models/originalCafe.js");

const app = express();

// Function to read and store images
const readAndStoreImages = async (directoryPath) => {
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      console.error('Unable to scan directory:', err);
      return;
    }

    files = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg')); // Filter for JPEG files
    files=files.map( file => path.join(directoryPath,file));
    const allOld=await Cafe.find({});
    let i=0;
    for (let old of allOld){
        const file=files[i];
        fs.readFile(file, async (err, data) => {
                if (err) {
                console.error(`Error reading file ${file}:`, err);
                return;
                }
        
                // Convert the buffer to a base64 string
                const base64Image = data.toString('base64');
                
                // Create a new image document
                const value=AllCafe({
                    cafeName:old.restaurant_name,
                    rating:old.rating,
                    avgPrice:old.average_price,
                    northIndian:old.north_indian_or_not,
                    southIndian:old.south_indian_or_not,
                    location:old.location,
                    filename:file ,
                    cafeImage: base64Image,
                });

                const saved=value.save();
                
            });
        i=(i+1)%(files.length);
    }
    });
};
module.exports={readAndStoreImages};

// files.forEach(file => {
//     const filePath = path.join(directoryPath, file);

//     fs.readFile(filePath, async (err, data) => {
//       if (err) {
//         console.error(`Error reading file ${file}:`, err);
//         return;
//       }

//       // Convert the buffer to a base64 string
//       const base64Image = data.toString('base64');

//       // Create a new image document
//       const newImage = new Image({
//         filename: file,
//         data: base64Image,
//       });

//       // Save the image document to MongoDB
//       try {
//         await newImage.save();
//         console.log(`Image ${file} stored successfully`);
//       } catch (saveErr) {
//         console.error(`Error saving image ${file}:`, saveErr);
//       }
//     });
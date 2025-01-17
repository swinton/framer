const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const app = express();

// Promisify exec to use with async/await
const execPromise = promisify(exec);

// Set up multer for handling image uploads
const upload = multer({ dest: 'uploads/' });

// Single POST endpoint to process images
app.post('/process-image', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image uploaded');
  }

  const inputImage = req.file.path;
  const outputImage = `processed-${Date.now()}.png`;

  try {
    // Use ImageMagick to process the image
    await execPromise(`convert ${inputImage} -resize 1000x1000 -gravity center -extent 1000x1000 miff:- | composite -geometry +40+40 - ${path.join(__dirname, 'Template.jpg')} ${outputImage}`);

    // Return the processed image
    res.sendFile(path.resolve(outputImage), (err) => {
      if (err) {
        return res.status(500).send('Error sending image');
      }

      // Clean up the uploaded file and processed file
      fs.unlinkSync(inputImage);
      fs.unlinkSync(outputImage);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error processing image');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

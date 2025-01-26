const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { AssemblyAI } = require('assemblyai');
const cloudinary = require('cloudinary').v2;

// Initialize AssemblyAI client
const client = new AssemblyAI({
  apiKey: '5a67904c1d1748228c3030839d0ea6fb',
  timeout: 60000
});

// Initialize Cloudinary configuration
cloudinary.config({
  cloud_name: 'dxkoqcipu',
  api_key: '993331217742527',
  api_secret: 'I0dJEarR_sYDcYPvVCZUGTZn5cc',
});

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route to handle video upload and transcription
app.post('/transcribe', async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: 'videoUrl is required' });
  }

  try {
    // Upload video to Cloudinary and convert it to MP3
    const cloudinaryResponse = await cloudinary.uploader.upload(videoUrl, {
      resource_type: 'video',
      format: 'mp3',
    });
    console.log(cloudinaryResponse);

    const mp3Url = cloudinaryResponse.secure_url;

    // Use AssemblyAI to transcribe the MP3 file
    const config = {
      audio_url: mp3Url,
    };

    const transcript = await client.transcripts.transcribe(config)
    console.log(transcript);
    res.json({ transcript: transcript.text });

  } catch (error) {
    console.error('Error during video upload or transcription:', error);
    res.status(500).json({ error: 'Failed to process video or transcribe audio' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const express = require('express');
const OpenAI = require('openai');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = 3000;

// Debug log to check if API key is being loaded
console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes' : 'No');

// Configure OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.static('./'));
app.use(express.json());

// Add endpoint for image generation
app.post('/generate-image', async (req, res) => {
    try {
        const { prompt, panelNumber } = req.body;
        console.log(`Generating image for panel ${panelNumber}:`, prompt);
        
        const enhancedPrompt = `Create a detailed graphic novel panel illustration: ${prompt}. 
            Make it visually striking and suitable for a comic panel. 
            Ensure clear focus on the main action and characters.`;

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: enhancedPrompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            style: "vivid"
        });

        console.log(`Successfully generated image for panel ${panelNumber}`);
        res.json({ 
            success: true, 
            imageUrl: response.data[0].url,
            panelNumber: panelNumber
        });
    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            panelNumber: req.body.panelNumber
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 
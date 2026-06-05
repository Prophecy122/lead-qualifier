const express = require('express');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post('/qualify', async (req, res) => {
  const { name, budget, description } = req.body;

  const completion = await client.chat.completions.create({
model: 'llama-3.3-70b-versatile',    messages: [
      {
        role: 'user',
        content: `You are a lead qualification assistant. Analyze this potential client and respond in JSON only, no extra text.

Name: ${name}
Budget: ${budget}
Project: ${description}

Respond with this exact JSON format:
{
  "score": (number 0-100),
  "grade": ("Hot" or "Warm" or "Cold"),
  "summary": (one sentence assessment),
  "recommendation": (one sentence on what to do next)
}`
      }
    ]
  });

  const result = JSON.parse(completion.choices[0].message.content);
  res.json(result);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
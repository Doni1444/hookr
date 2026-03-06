const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.BACKEND_PORT || 4000;

app.use(express.json());

app.post('/api/ideas', async (req, res) => {
  const { niche } = req.body || {};

  if (!niche || typeof niche !== 'string' || !niche.trim()) {
    return res.status(400).json({ error: 'Field "niche" is required.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is missing in .env.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        temperature: 0.8,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant for bloggers. Always respond with valid JSON only. Use Russian language for all text values.'
          },
          {
            role: 'user',
            content: `Niche: ${niche}. Return JSON in this exact schema: {"trends":"...","reelsIdeas":["...","...","..."],"headlineIdeas":["...","...","..."]}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI error ${response.status}: ${errorText}`);
    }

    const payload = await response.json();
    const raw = payload.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw || '{}');

    if (
      typeof parsed.trends !== 'string' ||
      !Array.isArray(parsed.reelsIdeas) ||
      !Array.isArray(parsed.headlineIdeas)
    ) {
      throw new Error('Model returned invalid schema.');
    }

    return res.json({
      trends: parsed.trends,
      reelsIdeas: parsed.reelsIdeas.slice(0, 3),
      headlineIdeas: parsed.headlineIdeas.slice(0, 3)
    });
  } catch (error) {
    console.error('OpenAI generation failed:', error);
    return res.status(502).json({ error: 'Failed to generate ideas. Please try again.' });
  }
});

app.listen(port, () => {
  console.log(`Backend API is running on http://localhost:${port}`);
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt manquant' });
  }
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);
    
    const response = await fetch(
`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    console.log('Gemini response:', JSON.stringify(data));
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Erreur de génération.';
    return res.status(200).json({ result });
  } catch (error) {
    console.log('Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}

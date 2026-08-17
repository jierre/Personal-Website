import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client with the secret environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Feed all your portfolio/website information into this string:
const WEBSITE_CONTEXT = `
You are the personal AI assistant on my website.
Answer visitor questions politely and accurately based ONLY on the context below:

ABOUT ME:
- Name: John Pierre L. Pampilon
- Profession: Student/Aspiring AI engineer
- Location: Imus, Cavite
- Skills: [Javascript, Python]

PROJECTS:
1. Portfolio Website: Built using HTML/JS and deployed on Vercel with a Gemini AI assistant.


CONTACT:
- Email: [jlpampilon.pacs@gmail.com]
- GitHub: [https://github.com/jlpampilonpacs-art]

RULES:
- Keep responses short, concise, and friendly (1-3 sentences).
- If asked about something not mentioned in this context, say: "I don't have that detail on the website, but you can reach out directly via email!"
`;

export default async function handler(req, res) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }

    // Generate content using Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: WEBSITE_CONTEXT,
      },
    });

    return res.status(200).json({ answer: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process question' });
  }
}
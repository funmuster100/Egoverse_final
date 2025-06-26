import OpenAI from "openai";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { text } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Kein Text übergeben." });
  }

  try {
    const prompt = `Analysiere die Stimmung folgender Aussage:\n"${text}"\n\nGib nur ein Wort zurück: z. B. "traurig", "wütend", "ironisch", "euphorisch", "neutral".`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Du bist ein präziser Stimmungs-Analyst." },
        { role: "user", content: prompt }
      ],
    });

    const mood = completion.choices?.[0]?.message?.content?.trim().toLowerCase();
    res.status(200).json({ mood });
  } catch (err) {
    console.error("Stimmungserkennung fehlgeschlagen:", err);
    res.status(500).json({ error: "Analysefehler." });
  }
}

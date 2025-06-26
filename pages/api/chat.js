
import OpenAI from "openai";
import { createSystemPrompt } from "../../utils/systemPrompt";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { profile, mode = "default", lang = "de", messages } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "API key fehlt." });
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Kein Nachrichtenverlauf übergeben." });
  }

  try {
    // ✳️ SystemPrompt + Stimmung
    const mood = profile?.currentMood || null;
    const systemPrompt = createSystemPrompt(profile, mode, lang, mood);

    // ✳️ Logging für Debug-Zwecke
    console.log("🧠 SystemPrompt:", systemPrompt);
    console.log("🎯 Stilprofil:", JSON.stringify(profile?.styleProfile, null, 2));

    // ✳️ Verlauf + System
    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatMessages,
    });

    const reply = completion.choices?.[0]?.message?.content?.trim() || "Ich konnte gerade nichts antworten.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ OpenAI Fehler:", err);
    res.status(500).json({ error: err.message });
  }
}

import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { chatText } = req.body;

  if (!chatText) {
    return res.status(400).json({ error: "Kein Text übergeben." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `Analysiere den folgenden Chatverlauf und gib eine strukturierte JSON-Antwort mit diesen Feldern zurück:

{
  stil: "...",                 // Schreibstil (locker, direkt, verspielt ...)
  ton: "...",                  // Tonalität (freundlich, provokant ...)
  dialektBasis: "...",         // z. B. "hochdeutsch", "schwäbisch", "bayrisch"
  dialektMischung: "...",      // Mischung oder lokale Färbung, z. B. "leicht schwäbisch eingefärbt"
  expressions: ["..."],        // typische Ausdrücke
  beispielAntwort: "...",      // kurze Beispielantwort im Stil der Person
  thinkingStyle: "...",        // Denkweise: rational, impulsiv, emotional …
  typicalPhrases: ["..."]      // Typische Satzanfänge wie "Ganz ehrlich …"
}

Schreibe nur gültiges JSON zurück – ohne Kommentare oder Erklärungen.`,
        },
        {
          role: "user",
          content: chatText,
        },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();
    const jsonStart = raw.indexOf("{");
    const jsonString = raw.slice(jsonStart);
    const parsed = JSON.parse(jsonString);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("Analysefehler:", err.message);
    return res.status(500).json({ error: "Analyse fehlgeschlagen." });
  }
}

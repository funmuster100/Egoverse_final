import { useState } from "react";

const QUESTIONS = [
  "Hey! 😊 Stell dir vor, ich bin dein Ego – wie würdest du mich begrüßen?",
  "Was war heute das erste, was dir durch den Kopf ging?",
  "Wie würdest du einem Freund erzählen, wie dein Tag gerade läuft?",
  "Was bringt dich auf die Palme? 🙃",
  "Und was bringt dich zum Lachen – so richtig?",
  "Wie würdest du reagieren, wenn ich gerade mies drauf wäre?",
  "Hast du einen Spruch oder Satz, den du oft verwendest?",
  "Zum Schluss: Was sollte ich unbedingt über dich wissen, damit ich wie du klinge?"
];

export default function StyleTest({ onComplete }) {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([{ from: "bot", text: QUESTIONS[0] }]);
  const [input, setInput] = useState("");
  const [guidedAnswers, setGuidedAnswers] = useState([]);
  const [freeInput, setFreeInput] = useState("");
  const [showFreeText, setShowFreeText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendAnswer = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { from: "user", text: input }];
    setMessages(newMessages);
    setGuidedAnswers((prev) => [...prev, input]);
    setInput("");

    if (step < QUESTIONS.length - 1) {
      setTimeout(() => {
        setMessages([...newMessages, { from: "bot", text: QUESTIONS[step + 1] }]);
        setStep(step + 1);
      }, 500);
    } else {
      setShowFreeText(true);
    }
  };

  const analyzeText = async (text) => {
    const res = await fetch("/api/analyze-style", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatText: text }),
    });
    const data = await res.json();
    return {
      stil: data.stil,
      ton: data.ton,
      dialektBasis: data.dialektBasis,
      dialektMischung: data.dialektMischung,
      expressions: Array.isArray(data.expressions)
        ? data.expressions
        : data.expressions?.split(",").map((s) => s.trim()) || [],
      beispielAntwort: data.beispielAntwort,
      thinkingStyle: data.thinkingStyle,
      typicalPhrases: Array.isArray(data.typicalPhrases)
        ? data.typicalPhrases
        : data.typicalPhrases?.split(",").map((s) => s.trim()) || [],
      contextualVocabulary: data.contextualVocabulary,
    };
  };

  const mergeProfileData = (a, b) => ({
    stil: b.stil || a.stil,
    ton: b.ton || a.ton,
    dialektBasis: b.dialektBasis || a.dialektBasis,
    dialektMischung: b.dialektMischung || a.dialektMischung,
    expressions: Array.from(new Set([...(a.expressions || []), ...(b.expressions || [])])),
    beispielAntwort: b.beispielAntwort || a.beispielAntwort,
    thinkingStyle: b.thinkingStyle || a.thinkingStyle,
    typicalPhrases: Array.from(new Set([...(a.typicalPhrases || []), ...(b.typicalPhrases || [])])),
    contextualVocabulary: {
      ...(a.contextualVocabulary || {}),
      ...(b.contextualVocabulary || {})
    }
  });

  const handleFreeSubmit = async () => {
    if (!freeInput.trim()) return;

    setLoading(true);
    setError("");

    try {
      const guidedText = guidedAnswers.join("\n");
      const freeText = freeInput;

      const [guidedProfile, freeProfile] = await Promise.all([
        analyzeText(guidedText),
        analyzeText(freeText),
      ]);

      const finalProfile = {
        styleProfile: mergeProfileData(guidedProfile, freeProfile),
      };

      onComplete(finalProfile);
    } catch (err) {
      console.error("Analysefehler:", err);
      setError("Analyse fehlgeschlagen. Bitte versuch es später nochmal.");
      onComplete({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      padding: "2rem",
      borderRadius: "16px",
      maxWidth: "600px",
      margin: "2rem auto",
      fontFamily: "'Segoe UI', sans-serif",
      color: "#eee",
      boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    }}>
      <h2 style={{ marginBottom: "1rem" }}>🗣 Schreibstil-Test</h2>

      {!showFreeText ? (
        <>
          <div style={{ maxHeight: "300px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", padding: "1rem", background: "#111", borderRadius: "12px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                background: msg.from === "user" ? "#2563eb" : "rgba(255,255,255,0.1)",
                padding: "10px 14px",
                borderRadius: "14px",
                maxWidth: "80%",
                color: "#fff",
              }}>
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: "center", marginTop: "1rem", color: "#0f0" }}>
                ✨ Stil wird analysiert...
              </div>
            )}
          </div>

          {!loading && (
            <div style={{ marginTop: "1rem", display: "flex", gap: "8px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAnswer()}
                placeholder="Deine Antwort..."
                style={{ flex: 1, padding: "12px", fontSize: "1rem", borderRadius: "10px", border: "1px solid #333", background: "#222", color: "#eee" }}
              />
              <button
                onClick={sendAnswer}
                style={{ background: "#10b981", color: "#fff", border: "none", padding: "0 18px", borderRadius: "10px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
              >
                Senden
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          <p style={{ marginBottom: "1rem", lineHeight: "1.6" }}>
            ✍️ Jetzt bist du dran! Schreib hier bitte frei von der Leber weg – als würdest du mit einem Freund chatten.
            <br />
            Nutze Emojis, rede im Dialekt, mach Pausen, sei ironisch oder emotional – ganz wie du eben bist.
            Erzähl einfach drauf los: dein Tag, was dich nervt, was dich freut, was du denkst.
          </p>
          <textarea
            value={freeInput}
            onChange={(e) => setFreeInput(e.target.value)}
            rows={8}
            placeholder="Hier kannst du alles loswerden..."
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "10px",
              background: "#222",
              border: "1px solid #333",
              color: "#eee",
              fontSize: "1rem",
              fontFamily: "inherit",
              lineHeight: "1.6",
              marginBottom: "1rem"
            }}
          />
          <button
            onClick={handleFreeSubmit}
            disabled={loading}
            style={{
              background: "#10b981",
              color: "#fff",
              padding: "12px 24px",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Abschicken
          </button>
        </>
      )}

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

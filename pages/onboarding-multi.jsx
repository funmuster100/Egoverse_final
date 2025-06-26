
import { useState } from "react";
import { useRouter } from "next/router";
import AvatarUpload from "../components/AvatarUpload";
import StyleTest from "../components/StyleTest";

const DIALECT_OPTIONS = [
  "hochdeutsch", "schwäbisch", "bayrisch", "berlinerisch",
  "kölsch", "sächsisch", "norddeutsch",
];

const questions = [
  { key: "name", label: "Wie heißt du?", tip: "Du kannst auch einen Spitznamen angeben." },
  { key: "age", label: "Wie alt bist du?", tip: "Dein Alter hilft deinem Ego, dich besser zu spiegeln." },
  { key: "job", label: "Was machst du beruflich?", tip: "Stell dir vor, du erklärst es einem Kind." },
  { key: "values", label: "Was sind dir im Leben besonders wichtig?", tip: "Werte wie Ehrlichkeit, Freiheit oder Familie?" },

  { key: "hobbies", label: "Was machst du gerne in deiner Freizeit?", tip: "Denk an Dinge, die dich wirklich erfüllen." },
  { key: "relationships", label: "Wie sieht dein Beziehungsleben aus?", tip: "Offen, ehrlich – so viel du magst." },
  { key: "identity", label: "Wie würdest du dich selbst in drei Worten beschreiben?", tip: "Intuitiv antworten – was kommt dir zuerst?" },
  { key: "change_event", label: "Gab es ein Ereignis, das dich besonders geprägt hat?", tip: "Ein Wendepunkt in deinem Leben?" },
  { key: "core_belief", label: "Gibt es einen Leitsatz, an dem du dich orientierst?", tip: "Ein Satz, der dich durchs Leben begleitet?" },
  { key: "calm", label: "Was bringt dich innerlich zur Ruhe?", tip: "Vielleicht ein Ort, ein Gedanke oder ein Mensch?" },
  { key: "vulnerability", label: "Wann fühlst du dich verletzlich?", tip: "Keine falsche Scheu – sei ehrlich zu dir." },
  { key: "conflict", label: "Wie gehst du mit inneren Konflikten um?", tip: "Was passiert, wenn du mit dir haderst?" },
  { key: "child_memory", label: "Was ist deine stärkste Erinnerung aus der Kindheit?", tip: "Schließ kurz die Augen und spür hinein." },
  { key: "parent_expectation", label: "Was wollten deine Eltern, dass du wirst?", tip: "Und wie fühlt sich das heute für dich an?" },
  { key: "future_self", label: "Was möchtest du in 10 Jahren über dich sagen können?", tip: "Schreib’s wie eine kurze Vision." },
  { key: "legacy", label: "Welche Spuren möchtest du bei anderen hinterlassen?", tip: "Was sollen Menschen mit dir verbinden?" },
  { key: "origin", label: "Woher kommst du?", tip: "Ort oder Region genügt – wir erkennen deinen Dialekt automatisch." },
  {
    key: "dialect",
    label: "Wähle deinen Dialekt",
    tip: "Falls die automatische Erkennung nicht stimmt.",
    type: "select",
    options: DIALECT_OPTIONS.map((d) => ({ value: d, label: d })),
  },
  {
    key: "isInfluencer",
    label: "Bist du Influencer oder möchtest du dein Ego öffentlich nutzen?",
    tip: "Das ermöglicht spezielles Branding und öffentliche Nutzung.",
    type: "select",
    options: [
      { value: "", label: "Bitte auswählen" },
      { value: "yes", label: "Ja" },
      { value: "no", label: "Nein" },
    ],
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [brandingLogo, setBrandingLogo] = useState(null);
  const [styleProfile, setStyleProfile] = useState([]);
const [brandingColor, setBrandingColor] = useState("#00ff88"); // oder beliebiger Startwert
  const currentQuestion = questions[step];
  const isAvatarStep = step === questions.length;
  const isStyleTestStep = step === questions.length + 1;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "origin") {
      const guessed = guessDialect(value);
      setAnswers((prev) => ({
        ...prev,
        origin: value,
        dialect: !prev.dialect || prev.dialect === guessDialect(prev.origin || "") ? guessed : prev.dialect,
      }));
    } else {
      setAnswers({ ...answers, [name]: value });
    }
  };

  const next = () => {
    if (step < questions.length + 1) {
      setStep(step + 1);
    } else {
      const profile = { ...answers, styleProfile };
      if (avatar) profile.avatar = avatar;
      if (brandingLogo && answers.isInfluencer === "yes") profile.brandingLogo = brandingLogo;
      localStorage.setItem("ego_profile", JSON.stringify(profile));
      router.push("/summary");
    }
  };

  function guessDialect(origin) {
    const loc = origin.toLowerCase();
    if (loc.includes("ravensburg") || loc.includes("wilhelmsdorf")) return "schwäbisch";
    if (loc.includes("münchen")) return "bayrisch";
    if (loc.includes("berlin")) return "berlinerisch";
    if (loc.includes("köln")) return "kölsch";
    if (loc.includes("hamburg")) return "norddeutsch";
    if (loc.includes("leipzig")) return "sächsisch";
    return "hochdeutsch";
  }

  const progressPercent = Math.round((step / (questions.length + 2)) * 100);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
      color: "#eee",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      fontFamily: "'Segoe UI', sans-serif",
      flexDirection: "column",
    }}>
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "1rem" }}>
        <div style={{
          height: "8px",
          background: "#222",
          borderRadius: "8px",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: "100%",
            background: "linear-gradient(to right, #00ffcc, #00ff88)",
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{
          marginTop: "0.4rem",
          fontSize: "0.85rem",
          color: "#aaa",
          textAlign: "right",
        }}>
          Schritt {step + 1} von {questions.length + 2}
        </div>
      </div>

      <div style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: "16px",
        padding: "2rem",
        maxWidth: "600px",
        width: "100%",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(6px)",
      }}>
        {isStyleTestStep ? (
         <StyleTest
  onComplete={({ styleProfile, thinkingStyle, typicalPhrases, dialektBasis, dialektMischung, beispielAntwort, expressions }) => {
    const combinedStyleProfile = {
      styleProfile,
      thinkingStyle,
      typicalPhrases,
      dialektBasis,
      dialektMischung,
      beispielAntwort,
      expressions
    };

    const fullProfile = {
      ...answers,
      styleProfile: combinedStyleProfile,  // 🧠 sauber verschachtelt
      avatar,
      brandingLogo,
      brandingColor,
    };

    localStorage.setItem("ego_profile", JSON.stringify(fullProfile));
    router.push("/summary");
  }}
/> 

        ) : isAvatarStep ? (
          <>
            <h2>Wähle ein Bild für dein Ego</h2>
            <AvatarUpload onAvatarSelect={setAvatar} />
            {answers.isInfluencer === "yes" && (
              <>
                <hr style={{ margin: "1.5rem 0" }} />
                <h3>Branding-Logo hochladen (optional)</h3>
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setBrandingLogo(reader.result);
                  reader.readAsDataURL(file);
                }} />
                {brandingLogo && (
                  <img src={brandingLogo} alt="Logo" style={{ maxWidth: "100px", marginTop: "1rem" }} />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <h2>{currentQuestion.label}</h2>
            {currentQuestion.type === "select" ? (
              <select
                name={currentQuestion.key}
                value={answers[currentQuestion.key] || ""}
                onChange={handleChange}
                style={{
                  width: "100%", padding: "14px", fontSize: "1rem",
                  borderRadius: "8px", background: "#222", border: "1px solid #333",
                  color: "#eee", marginBottom: "0.8rem"
                }}
              >
                <option value="">Bitte wählen</option>
                {currentQuestion.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                name={currentQuestion.key}
                value={answers[currentQuestion.key] || ""}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && next()}
                style={{
                  width: "100%", padding: "14px", fontSize: "1rem",
                  background: "#222", border: "1px solid #333",
                  color: "#eee", borderRadius: "8px", marginBottom: "0.8rem"
                }}
              />
            )}
            {currentQuestion.tip && (
              <p style={{ fontSize: "0.9rem", color: "#aaa" }}>{currentQuestion.tip}</p>
            )}
          </>
        )}

        {!isStyleTestStep && (
          <div style={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            marginTop: "1rem",
            flexWrap: "wrap"
          }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1,
                  minWidth: "120px",
                  padding: "14px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: "8px",
                  border: "none",
                  background: "#444",
                  color: "#fff",
                  cursor: "pointer"
                }}
              >
                Zurück
              </button>
            )}

            <button
              onClick={next}
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "14px",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                border: "none",
                background: "linear-gradient(to right, #00ffcc, #00ff88)",
                color: "#111",
                cursor: "pointer"
              }}
            >
              Weiter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

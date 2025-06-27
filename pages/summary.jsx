import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Summary() {
  const [profile, setProfile] = useState(null);
  const [exampleReply, setExampleReply] = useState("Lade Beispielantwort...");
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    const avatar = localStorage.getItem("ego_avatar");
    if (!p) return router.push("/onboarding-multi");

    const parsed = JSON.parse(p);
    if (avatar) parsed.avatar = avatar;
    setProfile(parsed);

    fetch(`${window.location.origin}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "Bitte antworte im Stil des Users" },
          { role: "user", content: "Mir geht’s nicht gut." }
        ],
        profile: parsed,
        mode: "default",
        lang: "de"
      }),
    })
      .then((res) => res.json())
      .then((data) => setExampleReply(data.reply || "Fehler bei der Antwort."))
      .catch(() => setExampleReply("Fehler beim Laden."));
  }, []);

  const downloadProfile = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ego_profile.json";
    a.click();
  };

  if (!profile) return <div style={styles.container}>Lade Profil...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.avatarBlock}>
          {profile.avatar ? (
            <Image
              src={profile.avatar}
              alt="Avatar"
              width={100}
              height={100}
              style={styles.avatarImage}
            />
          ) : (
            <div style={styles.avatarFallback}>🧠</div>
          )}
          <h2 style={styles.name}>
            Willkommen, {profile.name || "unbekannte Person"}
          </h2>
        </div>

        <h3 style={styles.sectionTitle}>🧾 Dein Profil</h3>
        <ul style={styles.infoList}>
          <Info label="Beruf" value={profile.job} />
          <Info label="Kommunikationsstil" value={profile.style || profile.styleProfile?.stil} />
          <Info label="Typischer Satz" value={`„${profile.phrase || "..."}“`} />
          <Info label="Werte" value={profile.values || profile.styleProfile?.values} />
          <Info label="Humor" value={profile.humor} />
          <Info label="Tonfall" value={profile.tone || profile.styleProfile?.ton} />
          <Info label="Hobbys" value={profile.hobbies} />
          <Info label="Beziehungen" value={profile.relationships} />
          <Info label="Dialekt" value={profile.dialect || profile.styleProfile?.dialektBasis} />
          <Info label="Denkweise" value={profile.thinkingStyle || profile.styleProfile?.thinkingStyle} />
          <Info label="Typische Ausdrücke" value={(profile.expressions || profile.styleProfile?.expressions || []).join(", ")} />
          <Info label="Typische Phrasen" value={(profile.typicalPhrases || profile.styleProfile?.typicalPhrases || []).join(", ")} />
        </ul>

        <h3 style={styles.sectionTitle}>🗣️ So klingt dein Ego-Zwilling</h3>
        <div style={styles.exampleBox}>
          {profile.beispielAntwort || exampleReply}
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={() => router.push("/chat")}>
            Starte dein Gespräch
          </button>
          <button style={styles.secondaryButton} onClick={downloadProfile}>
            Profil herunterladen
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <li style={styles.infoItem}>
      <strong style={styles.label}>{label}:</strong> {value || "–"}
    </li>
  );
}

const styles = {
  container: {
    background: "radial-gradient(circle at top, #1e1e1e, #0a0a0a)",
    color: "#f0f0f0",
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: "2rem",
    maxWidth: 680,
    width: "100%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
  },
  avatarBlock: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  avatarImage: {
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #00ffaa",
  },
  avatarFallback: {
    fontSize: 64,
    marginBottom: 16,
  },
  name: {
    fontSize: "1.8rem",
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: "1.2rem",
    color: "#00ffaa",
    margin: "1.5rem 0 0.5rem",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  infoItem: {
    marginBottom: 8,
    lineHeight: 1.6,
  },
  label: {
    color: "#00ffcc",
    fontWeight: 600,
  },
  exampleBox: {
    background: "#111",
    padding: "1rem",
    borderRadius: "12px",
    fontStyle: "italic",
    marginTop: 8,
    whiteSpace: "pre-wrap",
    color: "#eee",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
  },
  button: {
    background: "linear-gradient(to right, #00ffcc, #00ff88)",
    border: "none",
    borderRadius: 10,
    padding: "12px 20px",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#111",
    cursor: "pointer",
  },
  secondaryButton: {
    background: "none",
    border: "1px solid #00ffaa",
    color: "#00ffaa",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
};

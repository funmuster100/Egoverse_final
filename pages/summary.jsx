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
        {profile.avatar ? (
          <Image
            src={profile.avatar}
            alt="Avatar"
            width={80}
            height={80}
            style={styles.avatarImage}
          />
        ) : (
          <div style={styles.avatarFallback}>🧠</div>
        )}

        <h2 style={styles.name}>Willkommen, {profile.name || "unbekannte Person"}</h2>

        <h3 style={styles.sectionTitle}>🧾 Dein Profil</h3>
        <ul style={styles.infoList}>
          <Info label="Beruf" value={profile.job} />
          <Info label="Kommunikationsstil" value={profile.style} />
          <Info label="Typischer Satz" value={`„${profile.phrase}“`} />
          <Info label="Werte" value={profile.values} />
          <Info label="Humor" value={profile.humor} />
          <Info label="Tonfall" value={profile.tone} />
          <Info label="Hobbys" value={profile.hobbies} />
          <Info label="Beziehungen" value={profile.relationships} />
          <Info label="Dialekt" value={profile.dialect} />
          <Info label="Denkweise" value={profile.thinkingStyle} />
          <Info label="Typische Ausdrücke" value={profile.expressions} />
          <Info label="Typische Phrasen" value={(profile.typicalPhrases || []).join(", ")} />
        </ul>

        <h3 style={styles.sectionTitle}>🗣️ So klingt dein Ego-Zwilling</h3>
        <div style={styles.exampleBox}>
          {profile.beispielAntwort || exampleReply}
        </div>

        <button style={styles.button} onClick={() => router.push("/chat")}>
          Starte dein Gespräch
        </button>
        <button style={styles.secondaryButton} onClick={downloadProfile}>
          Profil herunterladen
        </button>
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
    background: "linear-gradient(to bottom, #0c0c0c, #1a1a1a)",
    color: "#eee",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 32,
    width: "100%",
    maxWidth: 600,
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
  },
  avatarImage: {
    borderRadius: "50%",
    marginBottom: 16,
    objectFit: "cover",
  },
  avatarFallback: {
    fontSize: 56,
    textAlign: "center",
    marginBottom: 16,
  },
  name: {
    textAlign: "center",
    fontSize: "1.6rem",
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: "1.2rem",
    color: "#00ffaa",
  },
  infoList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  infoItem: {
    marginBottom: 10,
    lineHeight: 1.4,
  },
  label: {
    color: "#00ff88",
  },
  exampleBox: {
    background: "#111",
    padding: "12px 16px",
    borderRadius: 8,
    marginTop: 8,
    fontStyle: "italic",
    whiteSpace: "pre-wrap",
  },
  button: {
    marginTop: 24,
    background: "linear-gradient(to right, #00ffcc, #00ff88)",
    color: "#111",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  secondaryButton: {
    marginTop: 12,
    background: "none",
    border: "1px solid #00ff88",
    color: "#00ff88",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
};

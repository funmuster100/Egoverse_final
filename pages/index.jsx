
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const start = () => {
    router.push("/onboarding-multi");
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(145deg, #0f0f0f, #1a1a1a)",
        color: "#f4f4f4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          marginBottom: "1.5rem",
          background: "linear-gradient(to right, #00ffcc, #00ff88)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Willkommen bei EgoVerse™
      </h1>

      <p
        style={{
          fontSize: "1.2rem",
          maxWidth: "640px",
          marginBottom: "2.5rem",
          color: "#ccc",
        }}
      >
        Erstelle jetzt deinen persönlichen digitalen Zwilling. Dein Ego denkt, redet und fühlt wie du.
      </p>

      <button
        onClick={start}
        style={{
          padding: "1rem 2.5rem",
          fontSize: "1.1rem",
          background: "linear-gradient(to right, #00ffcc, #00ff88)",
          color: "#111",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 0 20px rgba(0, 255, 170, 0.3)",
          transition: "transform 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        Jetzt starten
      </button>
    </div>
  );
}

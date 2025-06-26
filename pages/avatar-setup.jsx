import { useState } from "react";
import AvatarSelector from "../components/AvatarSelector";
import { useRouter } from "next/router";

export default function AvatarSetup() {
  const [selected, setSelected] = useState(null);
  const router = useRouter();

  const handleSave = () => {
    if (!selected) return;
    const profile = JSON.parse(localStorage.getItem("ego_profile") || "{}");
    const updated = { ...profile, avatar: selected.file };
    localStorage.setItem("ego_profile", JSON.stringify(updated));
    router.push("/chat");
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Wähle deinen digitalen Avatar</h2>
      <p>So wird dein Ego im Chat dargestellt – angepasst an deinen Modus.</p>
      <AvatarSelector selected={selected?.key} onSelect={setSelected} />
      <button
        onClick={handleSave}
        style={{
          marginTop: "2rem",
          padding: "10px 20px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
        disabled={!selected}
      >
        Speichern & weiter
      </button>
    </div>
  );
}

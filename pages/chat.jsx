
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "../styles/Chat.module.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState("default");
  const [lang, setLang] = useState("de");
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [textSpeed, setTextSpeed] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const [brandingLogo, setBrandingLogo] = useState(null);
  const [brandingColor, setBrandingColor] = useState("#00ff88");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const p = localStorage.getItem("ego_profile");
    if (p) {
      const parsed = JSON.parse(p);
        if (parsed.styleProfile) {
    console.log("Gelernter Stil:", parsed.styleProfile);
  }
        setProfile(parsed);
      if (parsed.brandingLogo) setBrandingLogo(parsed.brandingLogo);
      if (parsed.brandingColor) setBrandingColor(parsed.brandingColor);
      if (parsed.mode) setMode(parsed.mode);
      if (parsed.lang) setLang(parsed.lang);
    }
    const saved = localStorage.getItem("ego_chat_history");
    if (saved) setMessages(JSON.parse(saved));
    setDarkMode(document.documentElement.dataset.theme === "dark");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (messages.length) {
      localStorage.setItem("ego_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (!profile) return;
    const updated = { ...profile, mode, lang, brandingLogo, brandingColor };
    setProfile(updated);
    localStorage.setItem("ego_profile", JSON.stringify(updated));
  }, [mode, lang, brandingLogo, brandingColor]);

  const toggleTheme = () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    setDarkMode(next === "dark");
  };

  const send = async () => {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");
    setIsTyping(true);

    const safeProfile = { ...profile };
    delete safeProfile.brandingLogo;

    const recent = updated.slice(-10);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: safeProfile,
        mode,
        lang,
        messages: recent,
      }),
    });

    if (!res.ok) {
      console.error("Chat API Error:", await res.text());
      setIsTyping(false);
      return;
    }

    const { reply } = await res.json();
    setMessages([...updated, { role: "assistant", content: reply }]);
    setIsTyping(false);
    inputRef.current?.focus();
  };

    const remember = (text) => {
    const egoProfile = JSON.parse(localStorage.getItem("ego_profile") || "{}");
    if (!egoProfile.learningJournal) egoProfile.learningJournal = [];
    egoProfile.learningJournal.push({
      text,
      date: new Date().toISOString(),
    });
    localStorage.setItem("ego_profile", JSON.stringify(egoProfile));
    alert("Gemerkter Eintrag gespeichert ✨");
  };

  const BOT_AVATARS = {
    default: "/avatars/bot_default.jpeg",
    coach: "/avatars/bot_coach.jpeg",
    mentor: "/avatars/bot_mentor.jpeg",
    kritiker: "/avatars/bot_kritiker.jpeg",
  };

  const getAvatar = (role) =>
    role === "user"
      ? profile?.avatar?.startsWith("data:image")
        ? profile.avatar
        : "/avatars/user.png"
      : BOT_AVATARS[mode] || BOT_AVATARS.default;

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const upd = { ...profile, avatar: r.result };
      setProfile(upd);
      localStorage.setItem("ego_profile", JSON.stringify(upd));
    };
    r.readAsDataURL(file);
  };

  const handleBrandingLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => setBrandingLogo(r.result);
    r.readAsDataURL(file);
  };

  const handleBrandingColorChange = (e) =>
    setBrandingColor(e.target.value);

  return (
    <>
      <div
        className={styles["chat-container"]}
        style={{ borderTopColor: brandingColor }}
      >
        {/* Header */}
        <div
          className={styles["chat-header"]}
          style={{ borderBottomColor: brandingColor }}
        >
          <div className={styles["chat-header-left"]}>
            {brandingLogo && (
              <img
                src={brandingLogo}
                alt="Branding Logo"
                className={styles["branding-logo"]}
              />
            )}
            <label htmlFor="avatar-upload" style={{ cursor: "pointer" }}>
              <Image
                src={getAvatar("user")}
                alt="User Avatar"
                width={36}
                height={36}
                className={styles["avatar"]}
              />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleAvatarUpload}
            />
            <div>
              <div className={styles["chat-title"]}>Du (Ego)</div>
              <div className={styles["chat-status"]}>
                <span
                  className={styles["status-dot"]}
                  style={{ background: brandingColor }}
                />{" "}
                Online
              </div>
            </div>
          </div>
         <div className={styles["chat-header-right"]}>
  <button onClick={toggleTheme} title="Theme wechseln">🌓</button>
  <button onClick={() => setShowSettings(true)} title="Einstellungen">⚙️</button>
</div>
        </div>

        {/* Mode */}
        <div className={styles["chat-mode-selector"]}>
          <label>Modus:</label>
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="default">🧠 Ich selbst</option>
            <option value="coach">🗣️ Coach</option>
            <option value="mentor">🧓 Mentor</option>
            <option value="kritiker">⚡ Kritiker</option>
            <option value="reflexion">Reflexion</option>
          </select>
          <button
            className={styles["chat-reset"]}
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("ego_chat_history");
            }}
          >
            🗑️
          </button>
        </div>

        <div className={styles["chat-mode-indicator"]}>
          Aktueller Modus: <strong>{mode}</strong>
        </div>

        {/* Messages */}
        <div className={styles["chat-messages"]}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles["bubble-container"]} ${styles[m.role]}`}
            >
              <Image
                src={getAvatar(m.role)}
                alt={`${m.role}-avatar`}
                width={40}
                height={40}
                className={styles["avatar"]}
              />
              <div className={styles["bubble"]}>{m.content}
                {m.role === "assistant" && (
                  <button
                    onClick={() => remember(m.content)}
                    className={styles["remember-button"]}
                  >
                    ⭐ merken
                  </button>
                )}
              </div>
            </div>
            
          ))}
          {isTyping && (
            <div className={styles["typing-bubble"]}>
              <div className={styles["dot"]} />
              <div className={styles["dot"]} />
              <div className={styles["dot"]} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={styles["chat-input"]}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Frag dein Ego..."
          />
          <button onClick={send} style={{ background: brandingColor }}>
            Senden
          </button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div
          className={styles["settings-modal"]}
          onClick={() => setShowSettings(false)}
        >
          <div
            className={styles["settings-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Einstellungen</h2>
            {profile?.isInfluencer === "yes" && (
              <>
                <hr />
                <h3>Branding</h3>
                <label>
                  Logo:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBrandingLogoUpload}
                  />
                </label>
                {brandingLogo && (
                  <img
                    src={brandingLogo}
                    alt="Logo"
                    className={styles["branding-logo"]}
                  />
                )}
                <label>
                  Farbe:
                  <input
                    type="color"
                    value={brandingColor}
                    onChange={handleBrandingColorChange}
                  />
                </label>
              </>
            )}
            <button onClick={() => setShowSettings(false)}>Schließen</button>
          </div>
        </div>
      )}
    </>
  );
}

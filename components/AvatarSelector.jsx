import Image from "next/image";
import styles from "../styles/AvatarSelector.module.css";

const avatars = [
  { key: "default", label: "🧠 Ich selbst", file: "/avatars/bot_default.jpeg" },
  { key: "coach", label: "🗣️ Coach", file: "/avatars/bot_coach.jpeg" },
  { key: "mentor", label: "🧓 Mentor", file: "/avatars/bot_mentor.jpeg" },
  { key: "kritiker", label: "⚡ Kritiker", file: "/avatars/bot_kritiker.jpeg" },
];

export default function AvatarSelector({ selected, onSelect }) {
  return (
    <div className={styles.container}>
      {avatars.map((a) => (
        <div
          key={a.key}
          className={`${styles.avatarCard} ${
            selected === a.key ? styles.selected : ""
          }`}
          onClick={() => onSelect(a)}
        >
          <Image
            src={a.file}
            alt={a.label}
            width={120}
            height={120}
            className={styles.avatarImage}
          />
          <div className={styles.label}>{a.label}</div>
        </div>
      ))}
    </div>
  );
}


// components/AvatarUpload.jsx
import { useState } from "react";

export default function AvatarUpload({ onAvatarSelect }) {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        localStorage.setItem("ego_avatar", reader.result); // dauerhaft speichern
        onAvatarSelect(reader.result); // Übergabe an Parent-Komponente
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="avatar-upload">
      <label>Wähle ein Avatar-Bild:</label>
      <input type="file" accept="image/*" onChange={handleChange} />
      {preview && (
        <img
          src={preview}
          alt="Avatar Vorschau"
          className="avatar-preview"
          width={60}
          height={60}
        />
      )}
    </div>
  );
}

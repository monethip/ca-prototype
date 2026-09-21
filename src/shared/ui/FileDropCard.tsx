import { useState, type DragEvent } from "react";

const ACCEPT = ".pdf,.docx,.txt,.jpg,.jpeg,.png";
const HINT = "PDF, DOCX, TXT, JPG, or PNG up to 10MB";

interface FileDropCardProps {
  id: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  onChange: (value: string) => void;
}

export default function FileDropCard({ id, value, placeholder = "Drop your file here", required, invalid, onChange }: Readonly<FileDropCardProps>) {
  const [dragging, setDragging] = useState(false);

  function applyFile(file?: File) {
    onChange(file?.name || "");
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    applyFile(event.dataTransfer.files?.[0]);
  }

  return (
    <label
      className={"file-drop-card" + (dragging ? " dragging" : "") + (value ? " has-file" : "")}
      htmlFor={id}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        key={value || "empty"}
        id={id}
        className="file-drop-card-input"
        type="file"
        accept={ACCEPT}
        aria-required={required}
        aria-invalid={invalid || undefined}
        onChange={(e) => applyFile(e.target.files?.[0])}
      />
      <span className="file-drop-card-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 16V5M12 5l-4 4M12 5l4 4M5 19h14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <strong>{value || placeholder}</strong>
      <p>{value ? "Click to replace this document." : HINT}</p>
      <span className="file-drop-card-browse">Browse Files</span>
    </label>
  );
}

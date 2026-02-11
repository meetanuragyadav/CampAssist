
import { useState } from "react";

export default function ChatIcon() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <div className="chat-container" onClick={() => setOpen(true)}>
        <img
          className="chat-icon"
          src="images/chat.svg"
          alt="chat icon"
        />
      </div>

      {/* Dialog Overlay */}
      {open && (
        <div className="chat-overlay" onClick={() => setOpen(false)}>
          <div
            className="chat-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>🚀 Coming Soon</h3>
            <p>
              Future implementation using <strong>Microsoft AI</strong>.
            </p>

            <button onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

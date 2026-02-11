import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import Notifications from "./Notifications";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ STATES MUST BE HERE
  const [open, setOpen] = useState(false);                // profile dropdown
  const [showNotifications, setShowNotifications] = useState(false); // notifications

  const isBuyer = location.pathname === "/buyer";
  const isRunner = location.pathname === "/runner";

  return (
    <header className="z-navbar">
      <div className="z-navbar-inner">

        {/* LEFT */}
        <div className="z-left">
          <span className="z-logo" onClick={() => navigate("/")}>
            CampusAssist
          </span>

          <div className="z-location">
            <span className="dot" />
            <span>Campus</span>
            <span className="caret">▾</span>
          </div>
        </div>

        {/* CENTER SEARCH */}
        <div className="z-search">
          <span className="search-icon">🔍</span>
          <input placeholder="Search for requests, items or users" />
        </div>

        {/* RIGHT */}
        <div className="z-right">
          <div className="z-modes">
            <button
              className={isBuyer ? "active" : ""}
              onClick={() => navigate("/buyer")}
            >
              Buyer
            </button>
            <button
              className={isRunner ? "active" : ""}
              onClick={() => navigate("/runner")}
            >
              Runner
            </button>
          </div>

          <div className="z-profile">

            {/* 🔔 Notifications Bell */}
            <button
              className="bell"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setOpen(false);
              }}
            >
              🔔
            </button>

            <div className={`notif-wrapper ${showNotifications ? "open" : ""}`}>
  <Notifications />
</div>


            {/* 👤 Avatar */}
            <button
              className="avatar"
              onClick={() => {
                setOpen(!open);
                setShowNotifications(false);
              }}
            >
              👤
            </button>

            {open && (
              <div className="z-dropdown">
                <button onClick={() => navigate("/buyer")}>Buyer Mode</button>
                <button onClick={() => navigate("/runner")}>Runner Mode</button>
                <div className="divider" />
                <button
                  className="logout"
                  onClick={() => {
                    localStorage.clear();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </header>
  );
}

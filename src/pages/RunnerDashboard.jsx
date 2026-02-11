import { useEffect, useState } from "react";
import { getRunnerRequests, acceptRequest, completeRequest } from "../api";
import RequestCard from "../components/RequestCard";
import RunnerProfile from "../components/RunnerProfile";
import "./RunnerDashboard.css";

export default function RunnerDashboard() {
  const runnerEmail = localStorage.getItem("userEmail");
  const [available, setAvailable] = useState(true);

  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);

  // Load all available requests
  const loadRequests = async () => {
    try {
      const res = await getRunnerRequests();
      setRequests(
        (res.data || []).filter(
          (r) => r.status !== "DELIVERED"
        )
      );
    } catch (err) {
      console.error("Failed to load requests", err);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Accept a request
  const handleAccept = async (id) => {
  // 🔥 FORCE UI MODE SWITCH FIRST
  const accepted = requests.find(
    (r) => Number(r.id) === Number(id)
  );

  console.log("ACCEPTED REQUEST 👉", accepted);

  if (accepted) {
    setActiveRequest(accepted); // ✅ UI switches instantly
  }

  try {
    await acceptRequest(id, runnerEmail);
  } catch (err) {
    console.error("Failed to accept request", err);
  }
};

  // Mark request as completed
  const handleComplete = async (id) => {
    try {
      await completeRequest(id);
      setActiveRequest(null);
      loadRequests();
    } catch (err) {
      console.error("Failed to mark delivered", err);
    }
  };

  const completedRequests = requests.filter(
  r => r.status === "DELIVERED"
);

const totalEarnings = completedRequests.reduce(
  (sum, r) => sum + (r.tip || 0),
  0
);

  return (
    <div className="runner-control-card">
  <div className={`availability-toggle ${available ? "on" : "off"}`}>
    <div className="status-left">
      <span className="status-dot" />
      <span className="status-text">
        {available ? "Online" : "Offline"}
      </span>
    </div>


    <button
      className="toggle-btn"
      onClick={() => setAvailable(!available)}
    >
      {available ? "Go Offline" : "Go Online"}
    </button>
  </div>




      {/* LEFT PANEL */}
      <div className="runner-left">
        {activeRequest ? (
          <RunnerProfile
            request={activeRequest}
            onComplete={handleComplete}
          />
        ) : (
          <>
            <h2 className="runner-title">Available Requests</h2>

            {requests.length === 0 && (
              <p className="runner-empty">
                No available requests right now.
              </p>
            )}

            {available ? (
  requests.map(r => (
    <RequestCard
      key={r.id}
      r={r}
      isRunner
      onAccept={handleAccept}
    />
  ))
) : (
  <p className="runner-empty">
    You are currently offline.
  </p>
)}
<div className="runner-stats-card">
  <p className="stats-title">Today</p>

<div className="stats-row">
    <span>Deliveries</span>
    <strong>{completedRequests.length}</strong>
  </div>

  <div className="stats-row">
    <span>Earnings</span>
    <strong>₹{totalEarnings}</strong>
  </div>
  
</div>

<div className="runner-profile-card">
  <div className="profile-header">
    <span className="profile-icon">👤</span>
    <span className="profile-title">Runner Profile</span>
  </div>

  <p className="profile-name">
    {runnerEmail}
  </p>

  <div className="profile-stats">
    <div className="stat">
      <span className="label">Deliveries</span>
      <strong>{completedRequests.length}</strong>
    </div>

    <div className="stat">
      <span className="label">Earnings</span>
      <strong>₹{totalEarnings}</strong>
    </div>
  </div>
</div>

          </>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="runner-right">
        <div className="map-container">
          {activeRequest
            ? "Map will appear here (Azure Maps)"
            : "Browse requests"}
        </div>
      </div>

    </div>
  );
}

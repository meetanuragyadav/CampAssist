import { useEffect, useState } from "react";
import { getNotifications } from "../api";

export default function Notifications() {
  const email = localStorage.getItem("userEmail");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!email) return;

    const load = async () => {
      const res = await getNotifications(email);
      setItems(res.data || []);
    };

    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [email]);

  return (
    <div className="notifications-panel">
      <h4>Notifications</h4>
      {items.length === 0 && <p>No notifications</p>}
      {items.map((n) => (
        <div key={n.id} className="notification-item">
          {n.message}
        </div>
      ))}
    </div>
  );
}

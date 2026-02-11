import { useEffect, useState } from "react";
import { createRequest, getBuyerRequests } from "../api";
import RequestCard from "../components/RequestCard";
import buyerimage from "../assets/Buyer-Page.png";
import Toast from "../components/common/Toast";



export default function BuyerDashboard() {
  const email = localStorage.getItem("userEmail");

  const [toast, setToast] = useState({ message: "", type: "success" });


  // ✅ STATE MUST BE HERE
  const [showInfo, setShowInfo] = useState(false);

 

  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    item_name: "",
    category: "Food",
    urgency: "Medium",
    notes: "",
    prices:"",
    tip:0
  });

  const loadRequests = async () => {
    const res = await getBuyerRequests();
    setRequests(res.data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const submitRequest = async (e) => {
  e.preventDefault();
   console.log("SENDING REQUEST 👉", {
    ...form,
    requester_email: email
  });


  try {
    await createRequest({ ...form, requester_email: email });

    // ✅ SUCCESS TOAST
    setToast({
      message: "Request placed successfully",
      type: "success"
    });

    setForm({
      item_name: "",
      category: "Food",
      urgency: "Medium",
      notes: ""
    });

    loadRequests();
  } catch (err) {
    // ❌ ERROR TOAST
    setToast({
      message: "Failed to place request",
      type: "error"
    });
  }
};


  return (
    <>
      <section className="buyer-hero">
        <div className="buyer-container">

          {/* LEFT */}
          <div className="buyer-left">
            <h1 className="buyer-title">
              Request help on campus — instantly
            </h1>

            <p className="buyer-subtitle">
              Get food, documents, and essentials delivered by
              fellow students — fast and reliable.
            </p>

            <form className="buyer-form" onSubmit={submitRequest}>
              <input
                placeholder="Item name"
                value={form.item_name}
                onChange={(e) =>
                  setForm({ ...form, item_name: e.target.value })
                }
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Food</option>
                <option>Medicine</option>
                <option>Documents</option>
              </select>

              <select
                value={form.urgency}
                onChange={(e) =>
                  setForm({ ...form, urgency: e.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
              />
              <input
  type="number"
  placeholder="Item price (₹)"
  value={form.price}
  onChange={(e) =>
    setForm({ ...form, price: e.target.value })
  }
/>
<div className="tip-box">
  <p className="tip-label">Support your runner ❤️</p>
  <div className="tip-options">
    {[0, 10, 20, 50].map((amt) => (
      <button
        key={amt}
        type="button"
        className={`tip-btn ${
          form.tip === amt ? "active" : ""
        }`}
        onClick={() =>
          setForm({ ...form, tip: amt })
        }
      >
        ₹{amt}
      </button>
    ))}
  </div>
</div>
<div className="price-summary">
  <span>Total</span>
  <strong>
    ₹{Number(form.price || 0) + Number(form.tip || 0)}
  </strong>
</div>


              <button className="btn btn-primary">
                Create request
              </button>
            </form>


            {/* ACTION BUTTONS */}
            <div className="buyer-actions">
              <button
                className="buyer-btn-primary"
                onClick={() => setShowInfo(true)}
              >
                Check prices
              </button>

              <button
                className="buyer-btn-secondary"
                onClick={() => setShowInfo(true)}
              >
                Schedule for later
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="buyer-right">
            <img
              src={buyerimage}
              alt="Campus delivery"
              className="buyer-image"
            />
          </div>

        </div>
      </section>

      {/* ✅ MODAL AT ROOT LEVEL */}
      {showInfo && (
        <div className="info-overlay">
          <div className="info-modal">
            <h3>Coming Soon 🚀</h3>
            <p>
              Future implementation using <strong>Microsoft AI</strong>
            </p>

            <button
              className="info-close"
              onClick={() => setShowInfo(false)}
            >
              Got it
            </button>
           

          </div>
        </div>
      )}
       {toast.message && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast({ message: "", type: "success" })}
  />
)}
    </>
  );
}

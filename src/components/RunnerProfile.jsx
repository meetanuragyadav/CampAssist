export default function RunnerProfile({ request, onComplete }) {
  return (
    <div className="runner-profile">

      <h2 className="runner-title">Active Delivery</h2>

      <div className="profile-card">
        <p><strong>Item:</strong> {request.item_name}</p>
        <p><strong>Category:</strong> {request.category}</p>
        <p><strong>Urgency:</strong> {request.urgency}</p>

        {request.notes && (
          <p><strong>Notes:</strong> {request.notes}</p>
        )}

        <div className="runner-earning">
          <span className="earning-label">Runner incentive</span>
          <span className="earning-amount">
            ₹{request.tip || 0}
          </span>
        </div>

        <button
          className="request-btn btn-complete"
          onClick={() => onComplete(request.id)}
        >
          Mark as Delivered
        </button>
      </div>

    </div>
  );
}

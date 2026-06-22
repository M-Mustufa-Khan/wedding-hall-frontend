import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus, X, Building2 } from "lucide-react";
import { getHalls, createHall, deleteHall } from "../../services/api";
import "./AdminHalls.css";

const AdminHalls = () => {
  const [halls, setHalls] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [hallForm, setHallForm] = useState({
    name: "",
    location: "",
    capacity: "",
    pricePerDay: "",
    imageURL: "",
    description: "",
  });

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    setLoadingList(true);
    try {
      const res = await getHalls();
      setHalls(res.data || []);
    } catch {
      setHalls([]);
    } finally {
      setLoadingList(false);
    }
  };

  const handleAddHall = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createHall({
        name: hallForm.name,
        location: hallForm.location,
        capacity: parseInt(hallForm.capacity),
        pricePerDay: parseFloat(hallForm.pricePerDay),
        imageURL: hallForm.imageURL,
        description: hallForm.description,
        isActive: true,
      });
      setShowModal(false);
      setHallForm({
        name: "",
        location: "",
        capacity: "",
        pricePerDay: "",
        imageURL: "",
        description: "",
      });
      loadHalls();
    } catch (err) {
      alert("Failed to add hall. Check API connection.");
    }
    setSaving(false);
  };

  // ── DELETE — was completely missing before ──
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHall(deleteTarget.hallID);
      setHalls((prev) => prev.filter((h) => h.hallID !== deleteTarget.hallID));
      setDeleteTarget(null);
    } catch {
      alert("Failed to delete hall. Check API connection.");
    }
    setDeleting(false);
  };

  return (
    <div className="admin-halls-page">
      <div className="admin-header">
        <div>
          <h2>Manage Halls</h2>
          <p className="admin-header-sub">
            {halls.length} hall{halls.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add New Hall
        </button>
      </div>

      <div className="admin-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Price/Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingList ? (
              <tr>
                <td colSpan="6" className="table-empty">
                  Loading halls…
                </td>
              </tr>
            ) : halls.length === 0 ? (
              <tr>
                <td colSpan="6" className="table-empty-state">
                  <Building2 size={32} className="empty-icon-svg" />
                  <p>No halls added yet</p>
                  <span>Click "Add New Hall" to list your first venue.</span>
                </td>
              </tr>
            ) : (
              halls.map((hall) => (
                <tr key={hall.hallID}>
                  <td>
                    <img
                      src={
                        hall.imageURL ||
                        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100"
                      }
                      alt=""
                      className="hall-thumb"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100";
                      }}
                    />
                  </td>
                  <td>
                    <strong>{hall.name}</strong>
                  </td>
                  <td>{hall.location}</td>
                  <td>{hall.capacity}</td>
                  <td>Rs {hall.pricePerDay?.toLocaleString()}</td>
                  <td className="action-btns">
                    <button
                      className="icon-btn view"
                      title="Edit hall (coming soon)"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="icon-btn reject"
                      title="Delete hall"
                      onClick={() => setDeleteTarget(hall)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ══ ADD HALL MODAL ══ */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => !saving && setShowModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={20} />
            </button>
            <h2>Add New Hall</h2>
            <p className="modal-sub">
              This hall will be saved to your database and shown to customers
              immediately.
            </p>

            <form onSubmit={handleAddHall}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hall Name *</label>
                  <input
                    required
                    placeholder="e.g. Grand Royal Hall"
                    value={hallForm.name}
                    onChange={(e) =>
                      setHallForm({ ...hallForm, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    required
                    placeholder="e.g. Lahore"
                    value={hallForm.location}
                    onChange={(e) =>
                      setHallForm({ ...hallForm, location: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (Guests) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={hallForm.capacity}
                    onChange={(e) =>
                      setHallForm({ ...hallForm, capacity: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Price Per Day (Rs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 150000"
                    value={hallForm.pricePerDay}
                    onChange={(e) =>
                      setHallForm({ ...hallForm, pricePerDay: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group full">
                <label>Image URL *</label>
                <input
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={hallForm.imageURL}
                  onChange={(e) =>
                    setHallForm({ ...hallForm, imageURL: e.target.value })
                  }
                />
              </div>

              {hallForm.imageURL && (
                <div className="image-preview-row">
                  <img
                    src={hallForm.imageURL}
                    alt="Preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <span>Image preview</span>
                </div>
              )}

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the hall, its features, and ambiance..."
                  value={hallForm.description}
                  onChange={(e) =>
                    setHallForm({ ...hallForm, description: e.target.value })
                  }
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : "Save Hall to Database"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRMATION ══ */}
      {deleteTarget && (
        <div
          className="modal-overlay"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            className="modal-content confirm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-icon">⚠️</div>
            <h3>Delete "{deleteTarget.name}"?</h3>
            <p>
              This will permanently remove the hall from your database. This
              action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete Hall"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHalls;

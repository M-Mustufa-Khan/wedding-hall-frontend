import React, { useState, useEffect, useRef } from "react";
import { Edit2, Trash2, Plus, X, Building2, RefreshCw, Upload, Save } from "lucide-react";
import { getHalls, getHallById, createHall, updateHall, deleteHall } from "../../services/api";
import "./AdminHalls.css";

const EMPTY_FORM = {
  name: "",
  location: "",
  capacity: "",
  pricePerDay: "",
  imageURL: "",
  description: "",
  galleryImages: [],
  packages: [],
};

// ── Canvas-based image compression ──
const compressImage = (file, maxWidth = 1200, quality = 0.80) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

// ── Module-level file handlers (stable references, no re-creation on parent render) ──

const handleImageFile = async (e, setForm, currentForm) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { alert("Image too large. Maximum size is 5 MB."); return; }
  const compressed = await compressImage(file);
  setForm({ ...currentForm, imageURL: compressed });
  e.target.value = "";
};

const handleGalleryFile = async (e, form, setForm) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  const remaining = 5 - form.galleryImages.length;
  const toProcess = files.slice(0, remaining);
  for (const file of toProcess) {
    if (file.size > 5 * 1024 * 1024) { alert(`${file.name} is too large (max 5 MB).`); continue; }
    const compressed = await compressImage(file);
    setForm((prev) => ({ ...prev, galleryImages: [...prev.galleryImages, compressed] }));
  }
  e.target.value = "";
};

// ── Sub-components defined at module level so React never remounts them on parent re-render ──

const ImageUploadField = ({ form, setForm, imgRef }) => (
  <div className="form-group full">
    <label>Hall Image</label>
    <div
      className={`hall-img-upload ${form.imageURL ? "has-image" : ""}`}
      onClick={() => imgRef.current?.click()}
    >
      {form.imageURL ? (
        <>
          <img
            src={form.imageURL}
            alt="Preview"
            className="img-preview"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="img-overlay">
            <Upload size={18} />
            <span>Click to change</span>
          </div>
        </>
      ) : (
        <div className="img-placeholder">
          <div className="img-placeholder-icon">
            <Upload size={26} />
          </div>
          <p>Click to upload a photo</p>
          <span>JPG, PNG, WEBP — max 5 MB</span>
        </div>
      )}
    </div>
    <input
      ref={imgRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => handleImageFile(e, setForm, form)}
    />
    <div className="url-or-divider">
      <span>— or paste an image URL —</span>
    </div>
    <input
      className="url-input"
      placeholder="https://images.unsplash.com/..."
      value={form.imageURL?.startsWith("data:") ? "" : form.imageURL}
      onChange={(e) => setForm({ ...form, imageURL: e.target.value })}
    />
    {form.imageURL && (
      <button
        type="button"
        className="remove-img-btn"
        onClick={(e) => { e.stopPropagation(); setForm({ ...form, imageURL: "" }); }}
      >
        ✕ Remove image
      </button>
    )}
  </div>
);

const GalleryImagesField = ({ form, setForm, galleryRef }) => (
  <div className="form-group full">
    <label>
      Gallery Photos{" "}
      <span className="gallery-label-hint">(up to 5 — shown in hall detail page)</span>
    </label>
    <div className="gallery-upload-grid">
      {form.galleryImages.map((img, i) => (
        <div key={i} className="gallery-slot">
          <img
            src={img}
            alt=""
            className="gallery-slot-img"
            onError={(e) => { e.target.style.opacity = 0.3; }}
          />
          <button
            type="button"
            className="gallery-slot-remove"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                galleryImages: prev.galleryImages.filter((_, idx) => idx !== i),
              }))
            }
          >
            ✕
          </button>
        </div>
      ))}
      {form.galleryImages.length < 5 && (
        <div className="gallery-slot gallery-slot-add" onClick={() => galleryRef.current?.click()}>
          <Plus size={20} />
          <span>Add Photo</span>
        </div>
      )}
    </div>
    <input
      ref={galleryRef}
      type="file"
      accept="image/*"
      multiple
      style={{ display: "none" }}
      onChange={(e) => handleGalleryFile(e, form, setForm)}
    />
  </div>
);

const PackagesField = ({ form, setForm }) => {
  const addPkg = () =>
    setForm((prev) => ({
      ...prev,
      packages: [...prev.packages, { name: "", price: "", description: "", includes: "" }],
    }));

  const removePkg = (idx) =>
    setForm((prev) => ({
      ...prev,
      packages: prev.packages.filter((_, i) => i !== idx),
    }));

  const updatePkg = (idx, field, value) =>
    setForm((prev) => ({
      ...prev,
      packages: prev.packages.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));

  return (
    <div className="form-group full">
      <div className="pkg-field-header">
        <label>Packages</label>
        <button type="button" className="add-pkg-btn" onClick={addPkg}>
          <Plus size={13} /> Add Package
        </button>
      </div>
      {form.packages.length === 0 && (
        <p className="no-pkg-hint">No packages yet — click "Add Package" to create one.</p>
      )}
      {form.packages.map((pkg, idx) => (
        <div key={idx} className="pkg-form-card">
          <div className="pkg-form-top">
            <span className="pkg-form-label">Package {idx + 1}</span>
            <button type="button" className="remove-pkg-btn" onClick={() => removePkg(idx)}>
              <X size={12} /> Remove
            </button>
          </div>
          <div className="pkg-form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                placeholder="e.g. Gold Package"
                value={pkg.name}
                onChange={(e) => updatePkg(idx, "name", e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Price (Rs) *</label>
              <input
                type="number"
                placeholder="e.g. 80000"
                value={pkg.price}
                onChange={(e) => updatePkg(idx, "price", e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              placeholder="e.g. Full decoration + catering + DJ"
              value={pkg.description}
              onChange={(e) => updatePkg(idx, "description", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>
              Includes <span className="field-hint">(comma-separated)</span>
            </label>
            <input
              placeholder="e.g. Decoration,Catering,DJ,Photography"
              value={pkg.includes}
              onChange={(e) => updatePkg(idx, "includes", e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

const AdminHalls = () => {
  useEffect(() => { document.title = "Manage Halls — Admin | Elegant Celebrations"; }, []);

  const [halls, setHalls] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Add modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [addError, setAddError] = useState("");
  const addImgRef = useRef(null);
  const addGalleryRef = useRef(null);

  // Edit modal
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState("");
  const editImgRef = useRef(null);
  const editGalleryRef = useRef(null);

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    setLoadingList(true);
    setLoadError(false);
    try {
      const res = await getHalls();
      setHalls(res.data || []);
    } catch {
      setHalls([]);
      setLoadError(true);
    } finally {
      setLoadingList(false);
    }
  };

  // ── ADD ──
  const openAddModal = () => {
    setAddForm(EMPTY_FORM);
    setAddError("");
    setShowAddModal(true);
  };

  const handleAddHall = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAddError("");
    try {
      await createHall({
        name: addForm.name,
        location: addForm.location,
        capacity: parseInt(addForm.capacity),
        pricePerDay: parseFloat(addForm.pricePerDay),
        imageURL: addForm.imageURL,
        description: addForm.description,
        isActive: true,
        images: addForm.galleryImages.map((url) => ({ imageURL: url, isPrimary: false })),
        packages: addForm.packages
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name,
            description: p.description,
            price: parseFloat(p.price) || 0,
            includes: p.includes,
          })),
      });
      setShowAddModal(false);
      setAddForm(EMPTY_FORM);
      loadHalls();
    } catch {
      setAddError("Failed to add hall. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── EDIT ──
  const openEditModal = async (hall) => {
    // Pre-populate with list data immediately so modal opens fast
    setEditTarget(hall);
    setEditForm({
      name: hall.name || "",
      location: hall.location || "",
      capacity: hall.capacity || "",
      pricePerDay: hall.pricePerDay || "",
      imageURL: hall.imageURL || "",
      description: hall.description || "",
      galleryImages: [],
      packages: [],
    });
    setEditError("");

    // Then fetch full detail (images + packages) in background
    try {
      const res = await getHallById(hall.hallID);
      const full = res.data;
      setEditForm({
        name: full.name || "",
        location: full.location || "",
        capacity: full.capacity || "",
        pricePerDay: full.pricePerDay || "",
        imageURL: full.imageURL || "",
        description: full.description || "",
        galleryImages: (full.images || [])
          .filter((img) => !img.isPrimary)
          .map((img) => img.imageURL),
        packages: (full.packages || []).map((p) => ({
          name: p.name || "",
          price: p.price?.toString() || "",
          description: p.description || "",
          includes: p.includes || "",
        })),
      });
    } catch {
      // modal stays open with basic data; user can still edit scalar fields
    }
  };

  const handleEditHall = async (e) => {
    e.preventDefault();
    setEditing(true);
    setEditError("");
    try {
      await updateHall(editTarget.hallID, {
        hallID: editTarget.hallID,
        name: editForm.name,
        location: editForm.location,
        capacity: parseInt(editForm.capacity),
        pricePerDay: parseFloat(editForm.pricePerDay),
        imageURL: editForm.imageURL,
        description: editForm.description,
        isActive: editTarget.isActive ?? true,
        images: editForm.galleryImages.map((url) => ({ imageURL: url, isPrimary: false })),
        packages: editForm.packages
          .filter((p) => p.name.trim())
          .map((p) => ({
            name: p.name,
            description: p.description,
            price: parseFloat(p.price) || 0,
            includes: p.includes,
          })),
      });
      setEditTarget(null);
      loadHalls();
    } catch {
      setEditError("Failed to update hall. Check your connection and try again.");
    } finally {
      setEditing(false);
    }
  };

  // ── DELETE ──
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteHall(deleteTarget.hallID);
      setHalls((prev) => prev.filter((h) => h.hallID !== deleteTarget.hallID));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteTarget(null);
      if (err?.response?.status === 404) {
        setHalls((prev) => prev.filter((h) => h.hallID !== deleteTarget.hallID));
      } else {
        alert("Failed to delete hall. Check your connection.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-halls-page">

      {/* ══ PAGE HEADER ══ */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h2>Manage Halls</h2>
          <p className="admin-header-sub">
            {loadingList
              ? "Loading…"
              : `${halls.length} hall${halls.length !== 1 ? "s" : ""} listed`}
          </p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add New Hall
        </button>
      </div>

      {/* ══ ERROR BANNER ══ */}
      {loadError && (
        <div className="halls-error-banner">
          <span>Could not load halls. Check your connection.</span>
          <button className="retry-btn-halls" onClick={loadHalls}>
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ══ HALLS TABLE ══ */}
      <div className="admin-table-card">
        <div className="table-scroll-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Price / Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingList ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={`sk-${i}`}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}>
                        <div className={`hall-skeleton ${j === 0 ? "hall-skeleton-thumb" : ""}`} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : halls.length === 0 && !loadError ? (
                <tr>
                  <td colSpan="6">
                    <div className="table-empty-state">
                      <div className="empty-icon-wrap">
                        <Building2 size={28} />
                      </div>
                      <p>No halls added yet</p>
                      <span>Click "Add New Hall" to list your first venue.</span>
                    </div>
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
                      <span className="hall-name-cell">{hall.name}</span>
                    </td>
                    <td>{hall.location}</td>
                    <td>{hall.capacity?.toLocaleString()}</td>
                    <td>
                      <span className="price-cell">Rs {hall.pricePerDay?.toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="adm-btns">
                        <button
                          className="adm-btn adm-btn-edit"
                          title="Edit hall"
                          onClick={() => openEditModal(hall)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="adm-btn adm-btn-delete"
                          title="Delete hall"
                          onClick={() => setDeleteTarget(hall)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ ADD HALL MODAL ══ */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => !saving && setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowAddModal(false)}
              disabled={saving}
            >
              <X size={18} />
            </button>

            <h2>Add New Hall</h2>
            <p className="modal-sub">
              Fill in all details below — the hall goes live immediately after saving.
            </p>
            <div className="modal-gold-divider" />

            {addError && (
              <div className="form-error-banner">
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleAddHall}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hall Name *</label>
                  <input
                    required
                    placeholder="e.g. Grand Royal Hall"
                    value={addForm.name}
                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    required
                    placeholder="e.g. Lahore"
                    value={addForm.location}
                    onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (Guests) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 500"
                    value={addForm.capacity}
                    onChange={(e) => setAddForm({ ...addForm, capacity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price Per Day (Rs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 150000"
                    value={addForm.pricePerDay}
                    onChange={(e) => setAddForm({ ...addForm, pricePerDay: e.target.value })}
                  />
                </div>
              </div>

              <ImageUploadField form={addForm} setForm={setAddForm} imgRef={addImgRef} />
              <GalleryImagesField form={addForm} setForm={setAddForm} galleryRef={addGalleryRef} />
              <PackagesField form={addForm} setForm={setAddForm} />

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the hall, its features, and ambiance…"
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? "Saving…" : <><Save size={15} /> Save Hall</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ EDIT HALL MODAL ══ */}
      {editTarget && (
        <div className="modal-overlay" onClick={() => !editing && setEditTarget(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setEditTarget(null)}
              disabled={editing}
            >
              <X size={18} />
            </button>

            <h2>Edit Hall</h2>
            <p className="modal-sub">
              Changes are saved directly to the database and reflected immediately.
            </p>
            <div className="modal-gold-divider" />

            {editError && (
              <div className="form-error-banner">
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditHall}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Hall Name *</label>
                  <input
                    required
                    placeholder="e.g. Grand Royal Hall"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    required
                    placeholder="e.g. Lahore"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Capacity (Guests) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price Per Day (Rs) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.pricePerDay}
                    onChange={(e) => setEditForm({ ...editForm, pricePerDay: e.target.value })}
                  />
                </div>
              </div>

              <ImageUploadField form={editForm} setForm={setEditForm} imgRef={editImgRef} />
              <GalleryImagesField form={editForm} setForm={setEditForm} galleryRef={editGalleryRef} />
              <PackagesField form={editForm} setForm={setEditForm} />

              <div className="form-group full">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditTarget(null)}
                  disabled={editing}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={editing}>
                  {editing ? "Saving…" : <><Save size={15} /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRMATION ══ */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-wrap">
              <span className="confirm-warning-icon">⚠</span>
            </div>
            <h3>Delete "{deleteTarget.name}"?</h3>
            <p>
              This will permanently remove the hall and all its data. This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="btn-danger" onClick={confirmDelete} disabled={deleting}>
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

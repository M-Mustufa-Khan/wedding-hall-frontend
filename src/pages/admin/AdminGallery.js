import React, { useState, useEffect, useRef } from "react";
import { Trash2, Upload, Images, CheckCircle, AlertCircle, X, Loader } from "lucide-react";
import { getGalleryImages, uploadGalleryImage, deleteGalleryImage } from "../../services/api";
import "./AdminGallery.css";

const CATEGORIES = [
  "Ceremony Halls",
  "Reception",
  "Outdoor",
  "Decoration",
  "Bridal Room",
];

const CAT_ICONS = {
  "Ceremony Halls": "🏛️",
  "Reception":      "🥂",
  "Outdoor":        "🌿",
  "Decoration":     "✨",
  "Bridal Room":    "💐",
};

function compressImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1200;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function Toast({ toasts, remove }) {
  return (
    <div className="ag-toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`ag-toast ag-toast--${t.type}`}>
          {t.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{t.msg}</span>
          <button onClick={() => remove(t.id)}><X size={14} /></button>
        </div>
      ))}
    </div>
  );
}

const AdminGallery = () => {
  useEffect(() => { document.title = "Gallery Management — Admin"; }, []);

  const [images, setImages]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState("Ceremony Halls");
  const [uploading, setUploading]   = useState(false);
  const [caption, setCaption]       = useState("");
  const [preview, setPreview]       = useState(null);
  const [b64, setB64]               = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toasts, setToasts]         = useState([]);
  const [dragOver, setDragOver]     = useState(false);
  const fileRef = useRef();

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, msg, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts((p) => p.filter((t) => t.id !== id));

  const load = () => {
    setLoading(true);
    getGalleryImages()
      .then((res) => setImages(res.data || []))
      .catch(() => addToast("Failed to load gallery images", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      addToast("Please select a valid image file", "error"); return;
    }
    const compressed = await compressImage(file);
    setPreview(compressed);
    setB64(compressed);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!b64) { addToast("Please select an image first", "error"); return; }
    setUploading(true);
    try {
      await uploadGalleryImage({ category: activeTab, imageBase64: b64, caption });
      addToast("Image uploaded successfully");
      setPreview(null); setB64(""); setCaption("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch {
      addToast("Upload failed. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryImage(id);
      setImages((prev) => prev.filter((img) => img.id !== id));
      addToast("Image deleted");
    } catch {
      addToast("Delete failed", "error");
    } finally {
      setDeleteConfirm(null);
    }
  };

  const tabImages = images.filter((img) => img.category === activeTab);
  const countFor  = (cat) => images.filter((img) => img.category === cat).length;

  return (
    <div className="ag-wrap">
      <Toast toasts={toasts} remove={removeToast} />

      {/* ── Header ── */}
      <div className="ag-header">
        <div className="ag-header-left">
          <div className="ag-header-icon"><Images size={22} /></div>
          <div>
            <h1 className="ag-title">Gallery Management</h1>
            <p className="ag-subtitle">{images.length} photos across {CATEGORIES.length} categories</p>
          </div>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="ag-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`ag-tab${activeTab === cat ? " ag-tab--active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            <span className="ag-tab-icon">{CAT_ICONS[cat]}</span>
            <span className="ag-tab-label">{cat}</span>
            <span className="ag-tab-count">{countFor(cat)}</span>
          </button>
        ))}
      </div>

      {/* ── Upload Section ── */}
      <div className="ag-upload-section">
        <div className="ag-section-heading">
          <span className="ag-section-icon">{CAT_ICONS[activeTab]}</span>
          <h2 className="ag-section-title">Add to {activeTab}</h2>
        </div>

        <div className="ag-upload-body">
          {/* Drop zone */}
          <div
            className={`ag-dropzone${dragOver ? " ag-dropzone--over" : ""}${preview ? " ag-dropzone--has-preview" : ""}`}
            onClick={() => !preview && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="ag-preview-wrap">
                <img src={preview} alt="preview" className="ag-preview-img" />
                <button
                  className="ag-preview-remove"
                  onClick={(e) => { e.stopPropagation(); setPreview(null); setB64(""); if (fileRef.current) fileRef.current.value = ""; }}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="ag-dropzone-inner">
                <Upload size={32} strokeWidth={1.5} />
                <p className="ag-dropzone-text">Drop image here or <span>browse</span></p>
                <p className="ag-dropzone-hint">JPG, PNG, WEBP · Auto-compressed to 1200px</p>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="ag-file-input" onChange={(e) => handleFile(e.target.files[0])} />

          {/* Caption + Upload button */}
          <div className="ag-upload-controls">
            <input
              type="text"
              className="ag-caption-input"
              placeholder="Caption (optional)…"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={100}
            />
            <button
              className="ag-upload-btn"
              onClick={handleUpload}
              disabled={!b64 || uploading}
            >
              {uploading ? <><Loader size={16} className="ag-spin" /> Uploading…</> : <><Upload size={16} /> Upload Image</>}
            </button>
          </div>
        </div>
      </div>

      {/* ── Image Grid ── */}
      <div className="ag-grid-section">
        <div className="ag-grid-header">
          <h2 className="ag-grid-title">{activeTab} Photos</h2>
          <span className="ag-grid-count">{tabImages.length} image{tabImages.length !== 1 ? "s" : ""}</span>
        </div>

        {loading ? (
          <div className="ag-loading">
            <div className="custom-spinner" />
            <p>Loading gallery…</p>
          </div>
        ) : tabImages.length === 0 ? (
          <div className="ag-empty">
            <span className="ag-empty-icon">{CAT_ICONS[activeTab]}</span>
            <p>No photos in <strong>{activeTab}</strong> yet.</p>
            <p className="ag-empty-sub">Upload your first image above.</p>
          </div>
        ) : (
          <div className="ag-grid">
            {tabImages.map((img) => (
              <div key={img.id} className="ag-card">
                <div className="ag-card-img-wrap">
                  <img src={img.imageBase64} alt={img.caption || activeTab} className="ag-card-img" loading="lazy" />
                  <div className="ag-card-overlay">
                    <button
                      className="ag-delete-btn"
                      onClick={() => setDeleteConfirm(img)}
                      title="Delete image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                {img.caption && <p className="ag-card-caption">{img.caption}</p>}
                <p className="ag-card-date">{new Date(img.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="ag-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-icon"><Trash2 size={28} /></div>
            <h3 className="ag-modal-title">Delete Photo?</h3>
            <p className="ag-modal-sub">
              This will permanently remove the image from <strong>{deleteConfirm.category}</strong>. This cannot be undone.
            </p>
            {deleteConfirm.imageBase64 && (
              <img src={deleteConfirm.imageBase64} alt="to delete" className="ag-modal-thumb" />
            )}
            <div className="ag-modal-actions">
              <button className="ag-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="ag-modal-delete" onClick={() => handleDelete(deleteConfirm.id)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;

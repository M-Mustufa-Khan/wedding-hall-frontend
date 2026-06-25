import React, { useState, useEffect, useMemo } from "react";
import {
  Mail, Trash2, Eye, EyeOff, RefreshCw, X,
  Phone, Tag, Clock, User,
} from "lucide-react";
import { getContacts, markContactRead, deleteContact } from "../../services/api";
import "./AdminContacts.css";

const formatDate = (d) =>
  new Date(d).toLocaleString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const AC_PAGE_SIZE = 10;

const AdminContacts = () => {
  useEffect(() => { document.title = "Messages — Admin | Elegant Celebrations"; }, []);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState("all"); // all | unread | read
  const [page, setPage]         = useState(1);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getContacts();
      setMessages(res.data || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await markContactRead(msg.contactID);
        setMessages((prev) =>
          prev.map((m) => m.contactID === msg.contactID ? { ...m, isRead: true } : m)
        );
        setSelected((prev) => prev ? { ...prev, isRead: true } : prev);
      } catch { /* ignore */ }
    }
  };

  const handleToggleRead = async () => {
    if (!selected) return;
    const newReadState = !selected.isRead;
    try {
      await markContactRead(selected.contactID, newReadState);
      setMessages((prev) =>
        prev.map((m) =>
          m.contactID === selected.contactID ? { ...m, isRead: newReadState } : m
        )
      );
      setSelected((prev) => prev ? { ...prev, isRead: newReadState } : prev);
    } catch { /* ignore */ }
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteContact(id);
      setMessages((prev) => prev.filter((m) => m.contactID !== id));
      if (selected?.contactID === id) setSelected(null);
    } catch {
      alert("Failed to delete. Try again.");
    }
  };

  const filtered = useMemo(() => messages.filter((m) => {
    if (filter === "unread") return !m.isRead;
    if (filter === "read")   return m.isRead;
    return true;
  }), [messages, filter]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const totalPages = Math.max(1, Math.ceil(filtered.length / AC_PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pagedMessages = filtered.slice((safePage - 1) * AC_PAGE_SIZE, safePage * AC_PAGE_SIZE);

  return (
    <div className="ac-page">

      {/* ── Page Header ── */}
      <div className="ac-page-header">
        <div className="ac-page-header-left">
          <h2 className="ac-page-title">
            Messages
            {unreadCount > 0 && (
              <span className="ac-unread-badge">{unreadCount}</span>
            )}
          </h2>
        </div>
        <button className="ac-refresh-btn" onClick={load} title="Refresh">
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div className="ac-error-banner">
          <span>Could not load messages. Please try again.</span>
          <button onClick={load}>Retry</button>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div className="ac-tabs">
        {[
          { key: "all",    label: "All",    count: messages.length },
          { key: "unread", label: "Unread", count: unreadCount },
          { key: "read",   label: "Read",   count: messages.length - unreadCount },
        ].map((t) => (
          <button
            key={t.key}
            className={`ac-tab${filter === t.key ? " active" : ""}`}
            onClick={() => { setFilter(t.key); setPage(1); }}
          >
            {t.label}
            <span className="ac-tab-count">{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Message List ── */}
      <div className="contacts-list">
        {loading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="ac-skel-item">
                <div className="ac-skel-left">
                  <div className="ac-skel ac-skel-name" />
                  <div className="ac-skel ac-skel-email" />
                  <div className="ac-skel ac-skel-subject" />
                  <div className="ac-skel ac-skel-preview" />
                </div>
                <div className="ac-skel-right">
                  <div className="ac-skel ac-skel-date" />
                </div>
              </div>
            ))}
          </>
        ) : filtered.length === 0 ? (
          <div className="ac-empty">
            <div className="ac-empty-icon">
              <Mail size={36} />
            </div>
            <p className="ac-empty-title">
              {filter === "unread" ? "No unread messages" : "No messages yet"}
            </p>
            <p className="ac-empty-sub">
              {filter === "unread"
                ? "All messages have been read."
                : "When visitors send messages, they will appear here."}
            </p>
          </div>
        ) : (
          pagedMessages.map((msg) => (
            <div
              key={msg.contactID}
              className={`contact-item${!msg.isRead ? " unread" : ""}${selected?.contactID === msg.contactID ? " selected" : ""}`}
              onClick={() => openMessage(msg)}
            >
              {/* Left: sender info */}
              <div className="contact-item-left">
                <div className="contact-item-top">
                  <span className="contact-sender">{msg.name}</span>
                  <span className="contact-email-small">{msg.email}</span>
                </div>
                {msg.subject && (
                  <div className={`contact-subject${!msg.isRead ? " unread" : ""}`}>
                    {msg.subject}
                  </div>
                )}
                <p className="contact-preview">{msg.message}</p>
              </div>

              {/* Right: date + unread dot + delete */}
              <div className="contact-item-right">
                <span className="contact-date">{formatDate(msg.createdAt)}</span>
                <div className="contact-item-right-bottom">
                  {!msg.isRead && <span className="contact-unread-dot" title="Unread" />}
                  <button
                    className="ac-row-delete-btn"
                    title="Delete"
                    onClick={(e) => handleDelete(msg.contactID, e)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div className="ac-pagination">
          <button
            className="ac-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            ‹ Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`ac-page-btn${safePage === p ? " ac-page-btn--active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="ac-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next ›
          </button>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="ac-modal-overlay" onClick={() => setSelected(null)}>
          <div className="ac-modal" onClick={(e) => e.stopPropagation()}>

            {/* Close */}
            <button className="ac-modal-close" onClick={() => setSelected(null)}>
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="ac-modal-header">
              <div className="ac-modal-header-icon">
                <User size={20} />
              </div>
              <div>
                <h2 className="ac-modal-title">{selected.name}</h2>
                <p className="ac-modal-sub">Message Details</p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="ac-modal-divider" />

            {/* Info Grid */}
            <div className="ac-info-grid">
              <div className="ac-info-row">
                <div className="ac-info-cell">
                  <span className="ac-info-label">
                    <User size={11} /> From
                  </span>
                  <span className="ac-info-value">{selected.name}</span>
                </div>
                <div className="ac-info-cell">
                  <span className="ac-info-label">
                    <Mail size={11} /> Email
                  </span>
                  <a
                    className="ac-info-link"
                    href={`mailto:${selected.email}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {selected.email}
                  </a>
                </div>
              </div>

              <div className="ac-info-row">
                {selected.phone && (
                  <div className="ac-info-cell">
                    <span className="ac-info-label">
                      <Phone size={11} /> Phone
                    </span>
                    <a
                      className="ac-info-link"
                      href={`tel:${selected.phone}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {selected.phone}
                    </a>
                  </div>
                )}
                {selected.subject && (
                  <div className="ac-info-cell">
                    <span className="ac-info-label">
                      <Tag size={11} /> Subject
                    </span>
                    <span className="ac-info-value ac-info-gold">{selected.subject}</span>
                  </div>
                )}
              </div>

              <div className="ac-info-row">
                <div className="ac-info-cell">
                  <span className="ac-info-label">
                    <Clock size={11} /> Received
                  </span>
                  <span className="ac-info-value">{formatDate(selected.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Message Body */}
            <div className="ac-modal-message-body">
              <p>{selected.message}</p>
            </div>

            {/* Modal Actions */}
            <div className="ac-modal-actions">
              <a
                href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || "Your Message")}`}
                className="ac-btn-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail size={14} />
                Reply
              </a>

              <button
                className="ac-btn-ghost"
                onClick={handleToggleRead}
              >
                {selected.isRead ? (
                  <><EyeOff size={14} /> Mark as Unread</>
                ) : (
                  <><Eye size={14} /> Mark as Read</>
                )}
              </button>

              <button
                className="ac-btn-danger"
                onClick={() => handleDelete(selected.contactID)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import UserSidebar from "../components/UserSidebar";
import "../styles/LeadDetails.css";

function LeadDetails() {
  const { id } = useParams();

  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [summary, setSummary] = useState("");

  // =========================
  // Fetch Lead Details
  // =========================
  const fetchLead = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/lead/${id}`
      );

      setLead(response.data);
    } catch (error) {
      console.error("Lead Fetch Error:", error);
    }
  };

  // =========================
  // Fetch Notes
  // =========================
  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/call-notes/${id}`
      );

      setNotes(response.data);
    } catch (error) {
      console.error("Notes Fetch Error:", error);
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    fetchLead();
    fetchNotes();
  }, [id]);

  // =========================
  // Add New Note
  // =========================
  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      await axios.post(
        "http://localhost:5000/call-notes",
        {
          lead_id: id,
          note: newNote,
        }
      );

      setNewNote("");
      fetchNotes();
    } catch (error) {
      console.error("Add Note Error:", error);
    }
  };

  // =========================
  // Generate AI Summary
  // =========================
  const generateSummary = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/summarize-note",
        {
          note: newNote,
        }
      );

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Summary Error:", error);
    }
  };

  // =========================
  // Loading State
  // =========================
  if (!lead) {
    return (
      <div className="loading-screen">
        <h2>Loading Lead...</h2>
      </div>
    );
  }

  return (
    <div className="lead-details-page">

      <UserSidebar />

      <div className="lead-details-content">

        {/* Lead Information */}
        <div className="lead-card">

          <h2>{lead.name}</h2>

          <div className="lead-info">

            <p>
              <strong>Company:</strong>{" "}
              {lead.company || "N/A"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {lead.email || "N/A"}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {lead.phone || "N/A"}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {lead.status || "New"}
            </p>

          </div>

        </div>

        {/* Notes Section */}
        <div className="notes-section">

          <h3>Call Notes</h3>

          {/* Note Form */}
          <div className="note-form">

            <textarea
              placeholder="Write a call note..."
              value={newNote}
              onChange={(e) =>
                setNewNote(e.target.value)
              }
            />

            <div className="note-actions">

              <button
                className="add-note-btn"
                onClick={addNote}
              >
                Add Note
              </button>

              <button
                className="summary-btn"
                onClick={generateSummary}
              >
                Generate Summary
              </button>

            </div>

          </div>

          {/* AI Summary */}
          {summary && (
            <div className="summary-card">

              <h3>AI Summary</h3>

              <p>{summary}</p>

            </div>
          )}

          {/* Notes History */}
          <div className="notes-list">

            {notes.length === 0 ? (
              <p className="empty-notes">
                No notes available.
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="note-card"
                >

                  <p>{note.note}</p>

                  <small>
                    {new Date(
                      note.created_at
                    ).toLocaleString()}
                  </small>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default LeadDetails;
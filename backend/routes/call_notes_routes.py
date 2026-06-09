from flask import Blueprint, request, jsonify
from models import db, CallNote, Lead
from datetime import datetime

call_notes_bp = Blueprint( "call_notes", __name__ )

# =====================================
# Create Call Note
# =====================================

@call_notes_bp.route(
    "/call-notes",
    methods=["POST"]
)
def create_note():

    data = request.get_json()

    note = CallNote(
        lead_id=data["lead_id"],
        note=data["note"]
    )

    db.session.add(note)

    db.session.commit()

    return jsonify({
        "message": "Note added"
    }), 201

# =====================================
# Get Call Notes for Lead
# =====================================

@call_notes_bp.route(
    "/call-notes/<int:lead_id>",
    methods=["GET"]
)
def get_notes(lead_id):

    notes = CallNote.query.filter_by(
        lead_id=lead_id
    ).all()

    return jsonify([
        {
            "id": note.id,
            "note": note.note,
            "summary": note.summary,
            "created_at": note.created_at
        }
        for note in notes
    ])

# =====================================
# Summarize Note
# =====================================

@call_notes_bp.route(
    "/summarize-note",
    methods=["POST"]
)
def summarize_note():

    data = request.get_json()

    note_text = data.get("note")

    if not note_text:
        return jsonify({
            "message": "Note is required"
        }), 400

    # Mock AI Summary
    summary = (
        note_text[:120] + "..."
        if len(note_text) > 120
        else note_text
    )

    return jsonify({
        "summary": summary
    })


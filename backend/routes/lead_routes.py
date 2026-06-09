from flask import Blueprint, jsonify, request

from models import (
    db,
    Lead,
    Activity
)

lead_bp = Blueprint(
    "lead",
    __name__
)

# =====================================
# Create Lead
# =====================================

@lead_bp.route(
    "/leads",
    methods=["POST"]
)
def create_lead():

    data = request.get_json()

    lead = Lead(
        user_id=data["user_id"],
        name=data["name"],
        company=data.get("company"),
        phone=data.get("phone"),
        email=data.get("email")
    )

    lead = Lead(
    user_id=data["user_id"],
    name=data["name"],
    company=data.get("company"),
    phone=data.get("phone"),
    email=data.get("email"),
    status="New"
    )

    db.session.add(lead)

    activity = Activity(
        user_id=data["user_id"],
        action=f"Created lead: {data['name']}"
    )

    db.session.add(activity)

    db.session.commit()

    return jsonify({
        "message": "Lead created successfully"
    }), 201


# =====================================
# Get User Leads
# =====================================

@lead_bp.route(
    "/leads/<int:user_id>",
    methods=["GET"]
)
def get_leads(user_id):

    leads = Lead.query.filter_by(
        user_id=user_id
    ).all()

    return jsonify([
        {
            "id": lead.id,
            "name": lead.name,
            "company": lead.company,
            "phone": lead.phone,
            "email": lead.email,
            "status": lead.status
        }
        for lead in leads
    ])


# =====================================
# Update Lead
# =====================================

@lead_bp.route(
    "/lead/<int:id>",
    methods=["PUT"]
)
def update_lead(id):

    lead = db.session.get(
        Lead,
        id
    )

    if not lead:
        return jsonify({
            "message": "Lead not found"
        }), 404

    data = request.get_json()

    lead.name = data.get(
        "name",
        lead.name
    )

    lead.company = data.get(
        "company",
        lead.company
    )

    lead.phone = data.get(
        "phone",
        lead.phone
    )

    lead.email = data.get(
        "email",
        lead.email
    )

    lead.status = data.get(
        "status",
        lead.status
    )

    activity = Activity(
        user_id=lead.user_id,
        action=f"Lead '{lead.name}' updated"
    )

    db.session.add(activity)

    db.session.commit()

    return jsonify({
        "message": "Lead updated"
    })


# =====================================
# Delete Lead
# =====================================

@lead_bp.route(
    "/lead/<int:id>",
    methods=["DELETE"]
)
def delete_lead(id):

    lead = db.session.get(
        Lead,
        id
    )

    if not lead:
        return jsonify({
            "message": "Lead not found"
        }), 404
    
    activity = Activity(
    user_id=lead.user_id,
    action=f"Lead '{lead.name}' deleted"
    )

    db.session.add(activity)

    db.session.delete(lead)

    db.session.commit()

    return jsonify({
        "message": "Lead deleted"
    })

# =====================================
# Lead Stats    
# =====================================

@lead_bp.route(
    "/lead-stats/<int:user_id>",
    methods=["GET"]
)
def lead_stats(user_id):

    total = Lead.query.filter_by(
        user_id=user_id
    ).count()

    new = Lead.query.filter_by(
        user_id=user_id,
        status="New"
    ).count()

    contacted = Lead.query.filter_by(
        user_id=user_id,
        status="Contacted"
    ).count()

    qualified = Lead.query.filter_by(
        user_id=user_id,
        status="Qualified"
    ).count()

    closed = Lead.query.filter_by(
        user_id=user_id,
        status="Closed"
    ).count()

    return jsonify({
        "total_leads": total,
        "new": new,
        "contacted": contacted,
        "qualified": qualified,
        "closed": closed
    })

# =====================================
# Get Single Lead
# =====================================

@lead_bp.route(
    "/lead/<int:id>",
    methods=["GET"]
)
def get_single_lead(id):

    lead = db.session.get(
        Lead,
        id
    )

    if not lead:
        return jsonify({
            "message": "Lead not found"
        }), 404

    return jsonify({
        "id": lead.id,
        "name": lead.name,
        "company": lead.company,
        "phone": lead.phone,
        "email": lead.email,
        "status": lead.status
    })
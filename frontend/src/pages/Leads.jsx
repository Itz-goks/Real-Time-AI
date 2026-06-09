import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import UserSidebar from "../components/UserSidebar";
import "../styles/Leads.css";

function Leads() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activePage, setActivePage] = useState("leads");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!userId) {
      navigate("/", { replace: true });
      return;
    }

    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/leads/${userId}`
      );

      setLeads(res.data);
    } catch (err) {
      console.error("Fetch Leads Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEditChange = (e) => {
    setSelectedLead((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/leads", {
        user_id: userId,
        ...formData,
      });

      setFormData({
        name: "",
        company: "",
        phone: "",
        email: "",
      });

      fetchLeads();
    } catch (err) {
      console.error("Create Lead Error:", err);
    }
  };

  const openEditModal = (lead) => {
    setSelectedLead({ ...lead });
    setShowEditModal(true);
  };

  const updateLead = async () => {
    try {
      await axios.put(
        `http://localhost:5000/lead/${selectedLead.id}`,
        selectedLead
      );

      setShowEditModal(false);
      setSelectedLead(null);

      fetchLeads();
    } catch (err) {
      console.error("Update Lead Error:", err);
    }
  };

  const deleteLead = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/lead/${id}`
      );

      fetchLeads();
    } catch (err) {
      console.error("Delete Lead Error:", err);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();

    return (
      lead.name?.toLowerCase().includes(term) ||
      lead.company?.toLowerCase().includes(term) ||
      lead.email?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Leads...</h2>
      </div>
    );
  }

  return (
    <div className="leads-page">

      <UserSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <button
        className="menu-btn"
        onClick={() =>
          setIsSidebarOpen(!isSidebarOpen)
        }
      >
        ☰
      </button>

      <div className="leads-content">

        <h2>Lead Management</h2>

        {/* Stats */}
        <div className="lead-stats">
          <div className="stat-card">
            <h3>Total Leads</h3>
            <h1>{leads.length}</h1>
          </div>
        </div>

        {/* Create Lead */}
        <form
          className="lead-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Lead Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <button type="submit">
            Add Lead
          </button>
        </form>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search Leads..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        {/* Leads Table */}
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>
              <th width="180">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="6">
                  No Leads Found
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (

                <tr key={lead.id}>
                  
                  <td> <button className="lead-link"
                onClick={() => navigate(`/lead/${lead.id}`)}>{lead.name}</button>
                </td>

                  <td>{lead.company}</td>

                  <td>{lead.phone}</td>

                  <td>{lead.email}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        lead.status?.toLowerCase() || ""
                      }`}
                    >
                      {lead.status || "New"}
                    </span>
                  </td>

                <td className="actions-buttons">
                  <button className="view-btn"
                  onClick={() => navigate(`/lead/${lead.id}`) } >View </button>

                  <button className="edit-btn"
                  onClick={() => openEditModal(lead)}>Edit</button>

                  <button className="delete-btn"
                  onClick={() => deleteLead(lead.id)}>Delete</button>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Edit Modal */}
        {showEditModal && selectedLead && (
          <div className="modal-overlay">

            <div className="modal">

              <h2>Edit Lead</h2>

              <input
                name="name"
                value={selectedLead.name || ""}
                onChange={handleEditChange}
              />

              <input
                name="company"
                value={selectedLead.company || ""}
                onChange={handleEditChange}
              />

              <input
                name="phone"
                value={selectedLead.phone || ""}
                onChange={handleEditChange}
              />

              <input
                name="email"
                value={selectedLead.email || ""}
                onChange={handleEditChange}
              />

              <select
                name="status"
                value={selectedLead.status || "New"}
                onChange={handleEditChange}
              >
                <option value="New">
                  New
                </option>

                <option value="Contacted">
                  Contacted
                </option>

                <option value="Qualified">
                  Qualified
                </option>

                <option value="Interested">
                  Interested
                </option>

                <option value="Won">
                  Won
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>

              <div className="modal-buttons">

                <button
                  className="save-btn"
                  onClick={updateLead}
                >
                  Save
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLead(null);
                  }}
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>
        )}

      </div>
      
    </div>
  );
}

export default Leads;
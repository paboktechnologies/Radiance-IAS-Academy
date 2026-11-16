
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPopups.css";

const API_URL = "http://localhost:5000/api";

function AdminPopups() {
    const navigate = useNavigate();

    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Get Admin Token
    const getToken = () => {
        return localStorage.getItem("radianceAdminToken");
    };

    // Reset Form
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setImage("");
        setStartDate("");
        setEndDate("");
        setIsActive(true);
        setEditingId(null);
        setError("");
    };

    // Fetch All Advertisements
    const fetchPopups = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/popups/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch advertisements"
                );
            }

            setPopups(data.popups || []);

        } catch (error) {
            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPopups();
    }, []);

    // Add / Update Advertisement
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!getToken()) {
            setError("Admin login expired. Please login again.");
            return;
        }

        if (startDate && endDate && startDate > endDate) {
            setError("End date must be after start date.");
            return;
        }

        setSaving(true);

        const popupData = {
            title: title.trim(),
            description: description.trim(),
            image: image.trim(),
            startDate: startDate || null,
            endDate: endDate || null,
            isActive
        };

        try {
            const url = editingId
                ? `${API_URL}/popups/${editingId}`
                : `${API_URL}/popups`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(popupData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to save advertisement"
                );
            }

            setSuccess(
                editingId
                    ? "Advertisement updated successfully!"
                    : "Advertisement added successfully!"
            );

            resetForm();
            await fetchPopups();

        } catch (error) {
            setError(error.message);

        } finally {
            setSaving(false);
        }
    };

    // Edit Advertisement
    const handleEdit = (popup) => {
        setEditingId(popup._id);
        setTitle(popup.title || "");
        setDescription(popup.description || "");
        setImage(popup.image || "");

        setStartDate(
            popup.startDate
                ? popup.startDate.slice(0, 10)
                : ""
        );

        setEndDate(
            popup.endDate
                ? popup.endDate.slice(0, 10)
                : ""
        );

        setIsActive(popup.isActive);

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete Advertisement
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this advertisement?"
        );

        if (!confirmDelete) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/popups/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete advertisement"
                );
            }

            if (editingId === id) {
                resetForm();
            }

            setSuccess("Advertisement deleted successfully!");
            await fetchPopups();

        } catch (error) {
            setError(error.message);
        }
    };

    // Toggle Active / Inactive
    const handleStatusChange = async (popup) => {
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/popups/${popup._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        isActive: !popup.isActive
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update status"
                );
            }

            setSuccess("Advertisement status updated successfully!");
            await fetchPopups();

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="admin-popups-page">

            {/* Header */}
            <div className="admin-popups-header">

                <div>
                    <h1>Manage Home Popup</h1>

                    <p>
                        Add and manage academy advertisements displayed on the Home page.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-popup-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>

            </div>

            {/* Add / Edit Form */}
            <div className="admin-add-popup">

                <h2>
                    {editingId
                        ? "Edit Advertisement"
                        : "Add New Advertisement"}
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Title */}
                    <div className="admin-popup-form-group">

                        <label>Advertisement Title *</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Example: New Batch Admission Open"
                            required
                        />

                    </div>

                    {/* Description */}
                    <div className="admin-popup-form-group">

                        <label>Description (Optional)</label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter advertisement description"
                            rows="3"
                        />

                    </div>

                    {/* Image URL */}
                    <div className="admin-popup-form-group">

                        <label>Advertisement Image URL *</label>

                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Paste Google Drive share link here"
                            required
                        />

                        <small>
                            Upload your advertisement image to Google Drive,
                            enable Anyone with the link - Viewer permission,
                            and paste the link here.
                        </small>

                    </div>

                    {/* Date Fields */}
                    <div className="admin-popup-date-row">

                        <div className="admin-popup-form-group">

                            <label>Start Date (Optional)</label>

                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                        </div>

                        <div className="admin-popup-form-group">

                            <label>End Date (Optional)</label>

                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                        </div>

                    </div>

                    {/* Status */}
                    <div className="admin-popup-form-group">

                        <label>Advertisement Status</label>

                        <select
                            value={isActive ? "true" : "false"}
                            onChange={(e) =>
                                setIsActive(e.target.value === "true")
                            }
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                    </div>

                    {/* Error */}
                    {error && (
                        <p className="admin-popups-error">
                            {error}
                        </p>
                    )}

                    {/* Success */}
                    {success && (
                        <p className="admin-popups-success">
                            {success}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="admin-popup-form-buttons">

                        <button
                            type="submit"
                            className="admin-add-popup-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Advertisement"
                                    : "Add Advertisement"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-popup-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}

                    </div>

                </form>

            </div>

            {/* All Advertisements */}
            <div className="admin-popup-list">

                <h2>All Advertisements ({popups.length})</h2>

                {loading && (
                    <p>Loading advertisements...</p>
                )}

                {!loading && popups.length === 0 && (
                    <p className="admin-popups-empty">
                        No advertisements found.
                    </p>
                )}

                {!loading && popups.length > 0 && (

                    <div className="admin-popups-table-wrapper">

                        <table className="admin-popups-table">

                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {popups.map((popup) => (

                                    <tr key={popup._id}>

                                        <td>
                                            <strong>{popup.title}</strong>
                                        </td>

                                        <td>
                                            {popup.startDate
                                                ? new Date(popup.startDate).toLocaleDateString("en-IN")
                                                : "Not set"}
                                        </td>

                                        <td>
                                            {popup.endDate
                                                ? new Date(popup.endDate).toLocaleDateString("en-IN")
                                                : "Not set"}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className={
                                                    popup.isActive
                                                        ? "popup-status-active"
                                                        : "popup-status-inactive"
                                                }
                                                onClick={() => handleStatusChange(popup)}
                                            >
                                                {popup.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </button>
                                        </td>

                                        <td>
                                            <div className="admin-popup-actions">

                                                <button
                                                    type="button"
                                                    className="admin-popup-edit-btn"
                                                    onClick={() => handleEdit(popup)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-popup-delete-btn"
                                                    onClick={() => handleDelete(popup._id)}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminPopups;

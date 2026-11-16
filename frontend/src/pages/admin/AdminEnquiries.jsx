
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminEnquiries.css";

function AdminEnquiries() {
    const navigate = useNavigate();

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("radianceAdminToken");

    // Fetch all enquiries from backend
    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/enquiries/admin/all",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load enquiries"
                );
            }

            setEnquiries(data.enquiries || []);

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load enquiries when page opens
    useEffect(() => {
        fetchEnquiries();
    }, []);

    // Update enquiry status
    const updateStatus = async (id, status) => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/enquiries/admin/${id}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ status })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Status update failed"
                );
            }

            setEnquiries((previousEnquiries) =>
                previousEnquiries.map((enquiry) =>
                    enquiry._id === id
                        ? { ...enquiry, status }
                        : enquiry
                )
            );

            alert("Enquiry status updated successfully!");

        } catch (error) {
            alert(error.message);
            fetchEnquiries();
        }
    };

    // Format enquiry date
    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    return (
        <div className="admin-enquiries-page">

            {/* Page Header */}
            <div className="admin-enquiries-header">

                <div>
                    <h1>Manage Enquiries</h1>
                    <p>View and manage student enquiries</p>
                </div>

                <div className="enquiry-header-actions">

                    <button
                        className="enquiry-back-btn"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <button
                        className="enquiry-refresh-btn"
                        onClick={fetchEnquiries}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>

                </div>

            </div>

            {/* Summary Cards */}
            <div className="enquiry-summary">

                <div className="enquiry-summary-card">
                    <h3>{enquiries.length}</h3>
                    <p>Total Enquiries</p>
                </div>

                <div className="enquiry-summary-card">
                    <h3>
                        {enquiries.filter(
                            (item) => item.status === "New"
                        ).length}
                    </h3>
                    <p>New Enquiries</p>
                </div>

                <div className="enquiry-summary-card">
                    <h3>
                        {enquiries.filter(
                            (item) => item.status === "Contacted"
                        ).length}
                    </h3>
                    <p>Contacted</p>
                </div>

                <div className="enquiry-summary-card">
                    <h3>
                        {enquiries.filter(
                            (item) => item.status === "Completed"
                        ).length}
                    </h3>
                    <p>Completed</p>
                </div>

            </div>

            {/* Loading */}
            {loading && (
                <p className="enquiry-message">
                    Loading enquiries...
                </p>
            )}

            {/* Error */}
            {error && (
                <p className="enquiry-error">
                    {error}
                </p>
            )}

            {/* Empty Data */}
            {!loading && !error && enquiries.length === 0 && (
                <p className="enquiry-message">
                    No enquiries available.
                </p>
            )}

            {/* Enquiry Table */}
            {!loading && !error && enquiries.length > 0 && (

                <div className="enquiry-table-container">

                    <table className="enquiry-table">

                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Student Details</th>
                                <th>Interested Course</th>
                                <th>Message</th>
                                <th>Enquiry Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            {enquiries.map((enquiry, index) => (

                                <tr key={enquiry._id}>

                                    <td>{index + 1}</td>

                                    {/* Student Details */}
                                    <td>
                                        <strong>
                                            {enquiry.studentName}
                                        </strong>

                                        <span>
                                            {enquiry.mobile}
                                        </span>

                                        <span>
                                            {enquiry.email}
                                        </span>
                                    </td>

                                    {/* Interested Course */}
                                    <td>
                                        {enquiry.interestedCourse}
                                    </td>

                                    {/* Message */}
                                    <td className="enquiry-message-cell">
                                        {enquiry.message}
                                    </td>

                                    {/* Date */}
                                    <td>
                                        {formatDate(enquiry.createdAt)}
                                    </td>

                                    {/* Status Update */}
                                    <td>
                                        <select
                                            className={`enquiry-status-select ${(
                                                enquiry.status || "New"
                                            ).toLowerCase()}`}
                                            value={enquiry.status || "New"}
                                            onChange={(e) =>
                                                updateStatus(
                                                    enquiry._id,
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="New">
                                                New
                                            </option>

                                            <option value="Contacted">
                                                Contacted
                                            </option>

                                            <option value="Completed">
                                                Completed
                                            </option>

                                        </select>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default AdminEnquiries;

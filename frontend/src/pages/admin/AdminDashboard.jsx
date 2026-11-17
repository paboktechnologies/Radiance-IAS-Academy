
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import API_URL from "../../api";

function AdminDashboard() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [enquiries, setEnquiries] = useState([]);
    const [popups, setPopups] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("radianceAdminToken");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${token}`
                };

                const [
                    courseResponse,
                    enquiryResponse,
                    popupResponse
                ] = await Promise.all([
                    fetch(`${API_URL}/courses/admin/all`, { headers }),
                    fetch(`${API_URL}/enquiries/admin/all`, { headers }),
                    fetch(`${API_URL}/popups/admin/all`, { headers })
                ]);

                const courseData = await courseResponse.json();
                const enquiryData = await enquiryResponse.json();
                const popupData = await popupResponse.json();

                if (courseResponse.ok && courseData.success) {
                    setCourses(courseData.courses || []);
                }

                if (enquiryResponse.ok && enquiryData.success) {
                    setEnquiries(enquiryData.enquiries || []);
                }

                if (popupResponse.ok && popupData.success) {
                    setPopups(popupData.popups || []);
                }

            } catch (error) {
                console.error("Dashboard data error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("radianceAdminToken");
        navigate("/login");
    };

    // Course Reports
    const activeCourses = courses.filter(
        (item) => item.isActive === true
    ).length;

    const inactiveCourses = courses.filter(
        (item) => item.isActive === false
    ).length;

    // Popup Reports
    const activePopups = popups.filter(
        (item) => item.isActive === true
    ).length;

    const inactivePopups = popups.filter(
        (item) => item.isActive === false
    ).length;

    // Enquiry Reports
    const newEnquiries = enquiries.filter(
        (item) => item.status === "New"
    ).length;

    const contactedEnquiries = enquiries.filter(
        (item) => item.status === "Contacted"
    ).length;

    const completedEnquiries = enquiries.filter(
        (item) => item.status === "Completed"
    ).length;

    // Latest 5 Enquiries
    const recentEnquiries = [...enquiries]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    return (
        <div className="admin-dashboard">

            {/* Sidebar */}
            <aside className="admin-sidebar">

                <div className="admin-sidebar-logo">
                    <h2>RADIANCE</h2>
                    <p>IAS ACADEMY</p>
                </div>

                <nav className="admin-sidebar-menu">

                    <button
                        className="admin-menu-item active"
                        onClick={() => navigate("/admin/dashboard")}
                    >
                        Dashboard
                    </button>

                    <button
                        className="admin-menu-item"
                        onClick={() => navigate("/admin/courses")}
                    >
                        Manage Courses
                    </button>

                    <button
                        className="admin-menu-item"
                        onClick={() => navigate("/admin/gallery")}
                    >
                        Manage Gallery
                    </button>

                    <button
                        className="admin-menu-item"
                        onClick={() => navigate("/admin/popups")}
                    >
                        Home Popup
                    </button>

                    <button
                        className="admin-menu-item"
                        onClick={() => navigate("/admin/enquiries")}
                    >
                        Manage Enquiries
                    </button>

                </nav>

                <button
                    className="admin-logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </aside>

            {/* Main Dashboard */}
            <main className="admin-main-content">

                <header className="admin-topbar">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Radiance IAS Academy - Admin Panel</p>
                    </div>
                </header>

                <section className="admin-welcome-section">
                    <h2>Welcome, Admin!</h2>
                    <p>
                        Monitor your academy courses, advertisements
                        and student enquiries in one place.
                    </p>
                </section>

                {loading ? (
                    <p className="admin-report-loading">
                        Loading dashboard reports...
                    </p>
                ) : (
                    <>

                        {/* All Reports - Single Section */}
                        <section className="dashboard-report-section">

                            <div className="dashboard-section-heading">
                                <h2>Overall Reports</h2>
                                <p>Complete website statistics and reports</p>
                            </div>

                            <div className="dashboard-summary-grid">

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">📚</div>
                                    <p>Total Courses</p>
                                    <h3>{courses.length}</h3>
                                    <span>All courses</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">✅</div>
                                    <p>Active Courses</p>
                                    <h3>{activeCourses}</h3>
                                    <span>Visible courses</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">📖</div>
                                    <p>Inactive Courses</p>
                                    <h3>{inactiveCourses}</h3>
                                    <span>Hidden courses</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">📩</div>
                                    <p>Total Enquiries</p>
                                    <h3>{enquiries.length}</h3>
                                    <span>Student enquiries</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">🆕</div>
                                    <p>New Enquiries</p>
                                    <h3>{newEnquiries}</h3>
                                    <span>Waiting for response</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">📞</div>
                                    <p>Contacted Enquiries</p>
                                    <h3>{contactedEnquiries}</h3>
                                    <span>Students contacted</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">🎯</div>
                                    <p>Completed Enquiries</p>
                                    <h3>{completedEnquiries}</h3>
                                    <span>Completed enquiries</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">🖼️</div>
                                    <p>Total Home Popups</p>
                                    <h3>{popups.length}</h3>
                                    <span>All advertisements</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">🌟</div>
                                    <p>Active Popups</p>
                                    <h3>{activePopups}</h3>
                                    <span>Enabled advertisements</span>
                                </div>

                                <div className="dashboard-summary-card">
                                    <div className="summary-icon">⏸️</div>
                                    <p>Inactive Popups</p>
                                    <h3>{inactivePopups}</h3>
                                    <span>Disabled advertisements</span>
                                </div>

                            </div>

                        </section>

                        {/* Recent Enquiries */}
                        <section className="dashboard-report-section">

                            <div className="dashboard-section-heading">
                                <h2>Recent Enquiries</h2>
                                <p>Latest 5 student enquiries</p>
                            </div>

                            <div className="dashboard-recent-table-wrapper">

                                <table className="dashboard-recent-table">

                                    <thead>
                                        <tr>
                                            <th>Student Name</th>
                                            <th>Mobile</th>
                                            <th>Interested Course</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {recentEnquiries.length > 0 ? (
                                            recentEnquiries.map((item) => (
                                                <tr key={item._id}>
                                                    <td>{item.studentName}</td>
                                                    <td>{item.mobile}</td>
                                                    <td>{item.interestedCourse}</td>
                                                    <td>
                                                        <span className={`dashboard-status ${item.status.toLowerCase()}`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {new Date(item.createdAt).toLocaleDateString("en-IN")}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">
                                                    No enquiries available
                                                </td>
                                            </tr>
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            <button
                                className="dashboard-view-all-btn"
                                onClick={() => navigate("/admin/enquiries")}
                            >
                                View All Enquiries
                            </button>

                        </section>

                    </>
                )}

            </main>

        </div>
    );
}

export default AdminDashboard;


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminCourses.css";
import API_URL from "../../api";



function AdminCourses() {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eligibility, setEligibility] = useState("");
    const [isActive, setIsActive] = useState(true);

    // Get Admin Token
    const getToken = () => {
        return localStorage.getItem("radianceAdminToken");
    };

    // Reset Form
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setEligibility("");
        setIsActive(true);
        setEditingId(null);
    };

    // Fetch All Courses
    const fetchCourses = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/courses/admin/all`,
                {
                    headers: {
                        Authorization: `Bearer ${getToken()}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to fetch courses"
                );
            }

            setCourses(data.courses || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // Add / Update Course
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        const courseData = {
            title: title.trim(),
            description: description.trim(),
            eligibility: eligibility.trim(),
            isActive
        };

        try {
            const url = editingId
                ? `${API_URL}/courses/${editingId}`
                : `${API_URL}/courses`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify(courseData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to save course"
                );
            }

            setSuccess(
                editingId
                    ? "Course updated successfully!"
                    : "Course added successfully!"
            );

            resetForm();
            await fetchCourses();
        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    // Edit Course
    const handleEdit = (course) => {
        setEditingId(course._id);
        setTitle(course.title || "");
        setDescription(course.description || "");
        setEligibility(course.eligibility || "");
        setIsActive(course.isActive);

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete Course
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this course?"
        );

        if (!confirmDelete) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/courses/${id}`,
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
                    data.message || "Unable to delete course"
                );
            }

            if (editingId === id) {
                resetForm();
            }

            setSuccess("Course deleted successfully!");
            await fetchCourses();
        } catch (error) {
            setError(error.message);
        }
    };

    // Toggle Active / Inactive
    const handleStatusChange = async (course) => {
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/courses/${course._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        isActive: !course.isActive
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update status"
                );
            }

            setSuccess("Course status updated successfully!");
            await fetchCourses();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="admin-courses-page">

            {/* Header */}
            <div className="admin-courses-header">
                <div>
                    <h1>Manage Courses</h1>
                    <p>
                        Add, edit, view and manage academy courses.
                    </p>
                </div>

                <button
                    type="button"
                    className="admin-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {/* Add / Edit Form */}
            <div className="admin-add-course">
                <h2>
                    {editingId ? "Edit Course" : "Add New Course"}
                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Course Title */}
                    <div className="admin-form-group">
                        <label>Course Title *</label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            placeholder="Enter course title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="admin-form-group">
                        <label>Description *</label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            placeholder="Enter course description"
                            rows="4"
                            required
                        />
                    </div>

                    {/* Eligibility */}
                    <div className="admin-form-group">
                        <label>Eligibility</label>

                        <textarea
                            value={eligibility}
                            onChange={(e) =>
                                setEligibility(e.target.value)
                            }
                            placeholder="Enter eligibility details"
                            rows="3"
                        />
                    </div>

                    {/* Course Status */}
                    <div className="admin-form-group">
                        <label>Course Status</label>

                        <select
                            value={isActive ? "true" : "false"}
                            onChange={(e) =>
                                setIsActive(
                                    e.target.value === "true"
                                )
                            }
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="admin-courses-error">
                            {error}
                        </p>
                    )}

                    {/* Success Message */}
                    {success && (
                        <p className="admin-courses-success">
                            {success}
                        </p>
                    )}

                    {/* Form Buttons */}
                    <div className="admin-form-buttons">
                        <button
                            type="submit"
                            className="admin-add-course-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Course"
                                    : "Add Course"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                </form>
            </div>

            {/* All Courses */}
            <div className="admin-course-list">
                <h2>All Courses ({courses.length})</h2>

                {loading && <p>Loading courses...</p>}

                {!loading && courses.length === 0 && (
                    <p className="admin-courses-empty">
                        No courses found.
                    </p>
                )}

                {!loading && courses.length > 0 && (
                    <div className="admin-courses-table-wrapper">

                        <table className="admin-courses-table">
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Description</th>
                                    <th>Eligibility</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course._id}>

                                        <td>
                                            <strong>
                                                {course.title}
                                            </strong>
                                        </td>

                                        <td>{course.description}</td>

                                        <td>
                                            {course.eligibility ||
                                                "Not specified"}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className={
                                                    course.isActive
                                                        ? "course-status-active"
                                                        : "course-status-inactive"
                                                }
                                                onClick={() =>
                                                    handleStatusChange(course)
                                                }
                                            >
                                                {course.isActive
                                                    ? "Active"
                                                    : "Inactive"}
                                            </button>
                                        </td>

                                        <td>
                                            <div className="admin-course-actions">
                                                <button
                                                    type="button"
                                                    className="admin-edit-btn"
                                                    onClick={() =>
                                                        handleEdit(course)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-delete-btn"
                                                    onClick={() =>
                                                        handleDelete(course._id)
                                                    }
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

export default AdminCourses;

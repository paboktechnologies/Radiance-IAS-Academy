
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminGallery.css";
import API_URL from "../../api";


const NEW_CATEGORY = "__new__";

function AdminGallery() {
    const navigate = useNavigate();

    const [gallery, setGallery] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [editingId, setEditingId] = useState(null);

    const [image, setImage] = useState("");
    const [categoryChoice, setCategoryChoice] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [isActive, setIsActive] = useState(true);

    const getToken = () => localStorage.getItem("radianceAdminToken");

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${getToken()}`
    });

    const resetForm = () => {
        setImage("");
        setCategoryChoice("");
        setNewCategory("");
        setNewCategoryDescription("");
        setIsActive(true);
        setEditingId(null);
        setError("");
    };

    const fetchGallery = async () => {
        try {
            const response = await fetch(
                `${API_URL}/gallery/admin/all`,
                { headers: getAuthHeaders() }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to fetch gallery images");
            }

            setGallery(data.gallery || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${API_URL}/gallery-categories/admin/all`,
                { headers: getAuthHeaders() }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to fetch categories");
            }

            setCategories(data.categories || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const loadPageData = async () => {
        setLoading(true);
        setError("");

        await Promise.all([
            fetchGallery(),
            fetchCategories()
        ]);

        setLoading(false);
    };

    useEffect(() => {
        loadPageData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!getToken()) {
            setError("Admin login expired. Please login again.");
            return;
        }

        if (!image.trim()) {
            setError("Please enter the image URL.");
            return;
        }

        if (
            categoryChoice === NEW_CATEGORY &&
            !newCategory.trim()
        ) {
            setError("Please enter a new category name.");
            return;
        }

        if (!categoryChoice) {
            setError("Please select a gallery category.");
            return;
        }

        setSaving(true);

        try {
            let finalCategory = categoryChoice;

            if (categoryChoice === NEW_CATEGORY) {
                const categoryResponse = await fetch(
                    `${API_URL}/gallery-categories`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            ...getAuthHeaders()
                        },
                        body: JSON.stringify({
                            name: newCategory.trim(),
                            description: newCategoryDescription.trim()
                        })
                    }
                );

                const categoryData = await categoryResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryData.message || "Unable to create new category"
                    );
                }

                finalCategory = categoryData.category.name;
            }

            const galleryData = {
                image: image.trim(),
                category: finalCategory,
                isActive
            };

            const url = editingId
                ? `${API_URL}/gallery/${editingId}`
                : `${API_URL}/gallery`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeaders()
                },
                body: JSON.stringify(galleryData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to save gallery image"
                );
            }

            setSuccess(
                editingId
                    ? "Gallery image updated successfully!"
                    : "Gallery image added successfully!"
            );

            resetForm();
            await loadPageData();

        } catch (error) {
            setError(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item._id);
        setImage(item.image || "");
        setCategoryChoice(item.category || "");
        setNewCategory("");
        setNewCategoryDescription("");
        setIsActive(item.isActive);

        setError("");
        setSuccess("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this gallery image?"
        );

        if (!confirmDelete) return;

        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/gallery/${id}`,
                {
                    method: "DELETE",
                    headers: getAuthHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to delete gallery image"
                );
            }

            if (editingId === id) {
                resetForm();
            }

            setSuccess("Gallery image deleted successfully!");
            await loadPageData();

        } catch (error) {
            setError(error.message);
        }
    };

    const handleStatusChange = async (item) => {
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_URL}/gallery/${item._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({
                        isActive: !item.isActive
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update status"
                );
            }

            setSuccess("Gallery status updated successfully!");
            await loadPageData();

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="admin-gallery-page">

            <div className="admin-gallery-header">
                <div>
                    <h1>Manage Gallery</h1>
                    <p>Add and manage academy photos and events.</p>
                </div>

                <button
                    type="button"
                    className="admin-gallery-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="admin-add-gallery">

                <h2>
                    {editingId ? "Edit Gallery Image" : "Add New Gallery Image"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="admin-gallery-form-group">
                        <label>Select Gallery Category *</label>

                        <select
                            value={categoryChoice}
                            onChange={(e) => {
                                setCategoryChoice(e.target.value);
                                setNewCategory("");
                                setNewCategoryDescription("");
                            }}
                            required
                        >
                            <option value="">-- Select Category --</option>

                            {categories
                                .filter((item) => item.isActive)
                                .map((item) => (
                                    <option key={item._id} value={item.name}>
                                        {item.name}
                                    </option>
                                ))}

                            <option value={NEW_CATEGORY}>
                                + Add New Category
                            </option>
                        </select>

                        <small>
                            Select an existing category or create a new one.
                        </small>
                    </div>

                    {categoryChoice === NEW_CATEGORY && (
                        <>
                            <div className="admin-gallery-form-group">
                                <label>New Category Name *</label>

                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder="Example: Events, Classroom, Achievements"
                                    required
                                />
                            </div>

                            <div className="admin-gallery-form-group">
                                <label>Category Description (Optional)</label>

                                <textarea
                                    value={newCategoryDescription}
                                    onChange={(e) =>
                                        setNewCategoryDescription(e.target.value)
                                    }
                                    placeholder="Enter category description"
                                    rows="2"
                                />
                            </div>
                        </>
                    )}

                    <div className="admin-gallery-form-group">
                        <label>Gallery Image URL *</label>

                        <input
                            type="url"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="Paste Google Drive share link here"
                            required
                        />

                        <small>
                            Upload your image to Google Drive, enable
                            Anyone with the link - Viewer permission,
                            and paste the link here.
                        </small>
                    </div>

                    <div className="admin-gallery-form-group">
                        <label>Gallery Status</label>

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

                    {error && (
                        <p className="admin-gallery-error">{error}</p>
                    )}

                    {success && (
                        <p className="admin-gallery-success">{success}</p>
                    )}

                    <div className="admin-gallery-form-buttons">
                        <button
                            type="submit"
                            className="admin-add-gallery-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                    ? "Update Gallery Image"
                                    : "Add Gallery Image"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="admin-gallery-cancel-btn"
                                onClick={resetForm}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>

                </form>
            </div>

            <div className="admin-gallery-list">

                <h2>All Gallery Images ({gallery.length})</h2>

                {loading && <p>Loading gallery images...</p>}

                {!loading && gallery.length === 0 && (
                    <p className="admin-gallery-empty">
                        No gallery images found.
                    </p>
                )}

                {!loading && gallery.length > 0 && (
                    <div className="admin-gallery-table-wrapper">

                        <table className="admin-gallery-table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {gallery.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.category}</td>

                                        <td>
                                            <button
                                                type="button"
                                                className={
                                                    item.isActive
                                                        ? "gallery-status-active"
                                                        : "gallery-status-inactive"
                                                }
                                                onClick={() => handleStatusChange(item)}
                                            >
                                                {item.isActive ? "Active" : "Inactive"}
                                            </button>
                                        </td>

                                        <td>
                                            <div className="admin-gallery-actions">
                                                <button
                                                    type="button"
                                                    className="admin-gallery-edit-btn"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-gallery-delete-btn"
                                                    onClick={() => handleDelete(item._id)}
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

export default AdminGallery;

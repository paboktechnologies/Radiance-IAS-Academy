
import { useEffect, useState } from "react";
import "./Gallery.css";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/api";

function Gallery() {
    const [categories, setCategories] = useState([]);
    const [gallery, setGallery] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    // Extract Google Drive File ID
    const getFileId = (url) => {
        if (!url) return "";

        try {
            const parsedUrl = new URL(url);

            if (parsedUrl.hostname.includes("drive.google.com")) {
                return (
                    parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
                    parsedUrl.searchParams.get("id") ||
                    ""
                );
            }

            return "";
        } catch {
            return "";
        }
    };

    // Convert Google Drive URL into thumbnail URL
    const getImageUrl = (url) => {
        const fileId = getFileId(url);

        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        }

        return url || "";
    };

    // Google Drive preview URL for individual image modal
    const getPreviewUrl = (url) => {
        const fileId = getFileId(url);

        if (fileId) {
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }

        return url || "";
    };

    // Fetch Active Categories and Gallery Images
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const [categoryResponse, galleryResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/gallery-categories`),
                        fetch(`${API_URL}/gallery`)
                    ]);

                const categoryData = await categoryResponse.json();
                const galleryData = await galleryResponse.json();

                if (!categoryResponse.ok) {
                    throw new Error(
                        categoryData.message || "Unable to load categories"
                    );
                }

                if (!galleryResponse.ok) {
                    throw new Error(
                        galleryData.message || "Unable to load gallery"
                    );
                }

                setCategories(categoryData.categories || []);
                setGallery(galleryData.gallery || []);

            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGalleryData();
    }, []);

    // Get images belonging to a category
    const getCategoryImages = (categoryName) => {
        return gallery.filter(
            (item) =>
                item.category?.trim().toLowerCase() ===
                categoryName?.trim().toLowerCase()
        );
    };

    return (
        <div className="public-gallery-page">

            {/* Gallery Header */}
            <section className="gallery-hero">
                <span>OUR MEMORIES & MOMENTS</span>

                <h1>Our Gallery</h1>

                <p>
                    Explore the memorable moments, classroom activities,
                    special events and achievements of Radiance IAS Academy.
                </p>
            </section>

            {/* Gallery Content */}
            <section className="gallery-content">

                {loading && (
                    <p className="gallery-message">
                        Loading gallery...
                    </p>
                )}

                {!loading && error && (
                    <p className="gallery-error">
                        {error}
                    </p>
                )}

                {!loading && !error && categories.length === 0 && (
                    <p className="gallery-message">
                        Gallery categories will be updated soon.
                    </p>
                )}

                {/* Category Cards */}
                {!loading && !error && categories.length > 0 && (
                    <div className="gallery-category-cards">

                        {categories.map((category) => {
                            const images = getCategoryImages(category.name);
                            const coverImage = images[0];

                            return (
                                <div
                                    className="gallery-category-card"
                                    key={category._id}
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                >

                                    <div className="gallery-category-cover">

                                        {coverImage ? (
                                            <img
                                                src={getImageUrl(coverImage.image)}
                                                alt={category.name}
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <div className="gallery-category-placeholder">
                                                <span>📸</span>
                                                <p>Images Coming Soon</p>
                                            </div>
                                        )}

                                        <div className="gallery-category-overlay">
                                            <span>VIEW GALLERY</span>
                                        </div>

                                    </div>

                                    <div className="gallery-category-details">

                                        <h2>{category.name}</h2>

                                        <p>
                                            {images.length}{" "}
                                            {images.length === 1
                                                ? "Image"
                                                : "Images"}
                                        </p>

                                        {category.description && (
                                            <span>
                                                {category.description}
                                            </span>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </section>

            {/* Selected Category Images Modal */}
            {selectedCategory && (
                <div
                    className="gallery-category-modal-overlay"
                    onClick={() => setSelectedCategory(null)}
                >

                    <div
                        className="gallery-category-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="gallery-category-modal-header">

                            <div>
                                <h2>{selectedCategory.name}</h2>

                                <p>
                                    {getCategoryImages(selectedCategory.name).length}{" "}
                                    Images
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedCategory(null)}
                            >
                                ×
                            </button>

                        </div>

                        {getCategoryImages(selectedCategory.name).length === 0 ? (
                            <p className="gallery-message">
                                Images will be updated soon.
                            </p>
                        ) : (

                            <div className="gallery-category-image-grid">

                                {getCategoryImages(selectedCategory.name).map(
                                    (item) => (

                                        <div
                                            className="gallery-category-image-card"
                                            key={item._id}
                                            onClick={() =>
                                                setSelectedImage(item)
                                            }
                                        >

                                            <div className="gallery-category-image">

                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.title}
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none";
                                                    }}
                                                />

                                            </div>

                                            <div className="gallery-category-image-info">
                                                <h3>{item.title}</h3>

                                                {item.description && (
                                                    <p>{item.description}</p>
                                                )}
                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>
            )}

            {/* Individual Image Modal */}
            {selectedImage && (
                <div
                    className="gallery-modal-overlay"
                    onClick={() => setSelectedImage(null)}
                >

                    <button
                        type="button"
                        className="gallery-modal-close"
                        onClick={() => setSelectedImage(null)}
                    >
                        ×
                    </button>

                    <div
                        className="gallery-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <iframe
                            src={getPreviewUrl(selectedImage.image)}
                            title={selectedImage.title}
                            allow="autoplay"
                        />

                        <h3>{selectedImage.title}</h3>

                        <p>{selectedImage.description}</p>

                    </div>

                </div>
            )}
              {/* 7. FOOTER */}
            <Footer />

        </div>
    );
}

export default Gallery;

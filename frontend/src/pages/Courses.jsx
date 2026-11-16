
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Courses.css";
import Footer from "../components/Footer";

const API_URL = "http://localhost:5000/api";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch courses from backend
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_URL}/courses`);
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

        fetchCourses();
    }, []);

    return (
        <div className="courses-page">

            {/* Page Heading */}
            <section className="courses-header">
                <h1>Our Courses</h1>

                <p>
                    Choose the right course and begin your journey
                    towards success.
                </p>
            </section>

            {/* Courses List */}
            <section className="courses-section">

                {loading && (
                    <p className="courses-message">
                        Loading courses...
                    </p>
                )}

                {!loading && error && (
                    <p className="courses-error">
                        {error}
                    </p>
                )}

                {!loading && !error && courses.length === 0 && (
                    <p className="courses-message">
                        No courses available currently.
                    </p>
                )}

                {!loading && !error && courses.length > 0 && (
                    <div className="courses-grid">

                        {courses.map((course) => (
                            <div
                                className="course-card"
                                key={course._id}
                            >

                                {/* Course Name Design */}
                                <div className="course-name-design">

                                    <span className="course-academy-name">
                                        Radiance IAS Academy
                                    </span>

                                    <h2>{course.title}</h2>

                                    <span className="course-coaching-label">
                                        COACHING PROGRAM
                                    </span>

                                </div>

                                {/* Course Content */}
                                <div className="course-content">

                                    <p>{course.description}</p>

                                    <Link
                                        to={`/courses/${course._id}`}
                                        className="course-details-btn"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>
                        ))}

                    </div>
                )}


            </section>
              {/* 7. FOOTER */}
            <Footer />
        </div>
    );
}

export default Courses;

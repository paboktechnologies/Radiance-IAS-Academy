
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CourseDetails.css";
import API_URL from "../api";


function CourseDetails() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch single course from backend
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/courses/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to fetch course details"
                    );
                }

                setCourse(data.course);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [id]);

    // Loading
    if (loading) {
        return (
            <div className="course-details-message">
                Loading course details...
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="course-details-message course-details-error">
                {error}
                <br />
                <Link to="/courses">Back to Courses</Link>
            </div>
        );
    }

    // Course not found
    if (!course) {
        return (
            <div className="course-details-message">
                Course not found.
                <br />
                <Link to="/courses">Back to Courses</Link>
            </div>
        );
    }

    return (
        <div className="course-details-page">

            {/* Course Header */}
            <section className="course-details-header">
                <h1>{course.title}</h1>

                <p>
                    Explore our course and take the next step
                    towards your career success.
                </p>
            </section>

            {/* Course Information */}
            <section className="course-details-section">
                <div className="course-details-container">

                    {/* Course Name Design */}
                    <div className="course-details-name-design">
                        <span className="course-details-academy-name">
                            Radiance IAS Academy
                        </span>

                        <h2>{course.title}</h2>

                        <span className="course-details-label">
                            COACHING PROGRAM
                        </span>
                    </div>

                    {/* Course Content */}
                    <div className="course-details-content">

                        <h2>About This Course</h2>

                        <p className="course-details-description">
                            {course.description}
                        </p>

                        {/* Eligibility */}
                        <div className="course-eligibility">
                            <h3>Eligibility</h3>

                            <p>
                                {course.eligibility ||
                                    "Please contact our academy for eligibility details."}
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="course-details-buttons">
                            <Link
                                to="/contact"
                                className="course-enquiry-btn"
                            >
                                Enquire Now
                            </Link>

                            <Link
                                to="/courses"
                                className="back-courses-btn"
                            >
                                Back to Courses
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default CourseDetails;

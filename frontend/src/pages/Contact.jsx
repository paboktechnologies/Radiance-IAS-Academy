
import { useEffect, useState } from "react";
import "./Contact.css";
import Footer from "../components/Footer";
function Contact() {

    const [courses, setCourses] = useState([]);

    const [formData, setFormData] = useState({
        studentName: "",
        mobile: "",
        email: "",
        interestedCourse: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [responseType, setResponseType] = useState("");

    // Fetch Courses from Backend
    useEffect(() => {

        const fetchCourses = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/courses"
                );

                const data = await response.json();

                if (response.ok) {
                    setCourses(data.courses || []);
                }

            } catch (error) {
                console.error("Course fetching error:", error);
            }
        };

        fetchCourses();

    }, []);

    // Handle Input Changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    // Submit Enquiry
    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setResponseMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/enquiries",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (response.ok) {

                setResponseType("success");
                setResponseMessage(
                    "Your enquiry has been submitted successfully!"
                );

                setFormData({
                    studentName: "",
                    mobile: "",
                    email: "",
                    interestedCourse: "",
                    message: ""
                });

            } else {

                setResponseType("error");
                setResponseMessage(
                    data.message || "Unable to submit your enquiry."
                );

            }

        } catch (error) {

            console.error("Enquiry submission error:", error);

            setResponseType("error");
            setResponseMessage(
                "Server error. Please try again later."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="contact-page">

            {/* Contact Hero Section */}
            <section className="contact-hero">

                <span>GET IN TOUCH</span>

                <h1>Contact Us</h1>

                <p>
                    Take the first step towards your dream career.
                    Contact Radiance IAS Academy for guidance and support.
                </p>

            </section>


            {/* Contact Form Section */}
            <section className="contact-section">

                <div className="contact-info">

                    <span className="contact-tag">
                        WE ARE HERE TO HELP
                    </span>

                    <h2>
                        Let's Start Your
                        <span> Success Journey</span>
                    </h2>

                    <p>
                        Have questions about our coaching programmes?
                        Send us your details. Our team will get in touch
                        with you.
                    </p>

                    <div className="contact-detail">

                        <h3>Address</h3>

                        <p>
                             Ground Floor, No:33, Parvathavardhini St,Old Employment Office Road,Ramavarmapuram,
                        Nagercoil,
                        Kanyakumari District,
                        Tamil Nadu - 629001.
                        </p>

                    </div>

                    <div className="contact-detail">

                        <h3>Contact Us</h3>

                        <p>94882 51744</p>

                    </div>

                </div>


                {/* Student Enquiry Form */}
                <div className="contact-form-container">

                    <h2>Send Your Enquiry</h2>

                    <p>Fill in your details below.</p>

                    <form onSubmit={handleSubmit}>

                        <div className="contact-form-group">

                            <label>Student Name</label>

                            <input
                                type="text"
                                name="studentName"
                                placeholder="Enter your full name"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="contact-form-group">

                            <label>Mobile Number</label>

                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Enter 10 digit mobile number"
                                value={formData.mobile}
                                onChange={handleChange}
                                pattern="[6-9][0-9]{9}"
                                maxLength="10"
                                required
                            />

                        </div>


                        <div className="contact-form-group">

                            <label>Email Address</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="contact-form-group">

                            <label>Interested Course</label>

                            <select
                                name="interestedCourse"
                                value={formData.interestedCourse}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select a course
                                </option>

                                {courses.map((course) => (

                                    <option
                                        key={course._id}
                                        value={course.title}
                                    >
                                        {course.title}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div className="contact-form-group">

                            <label>Your Message</label>

                            <textarea
                                name="message"
                                placeholder="Write your message..."
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {responseMessage && (

                            <div className={`contact-response ${responseType}`}>
                                {responseMessage}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="contact-submit-btn"
                            disabled={loading}
                        >

                            {loading
                                ? "Submitting..."
                                : "Submit Enquiry"
                            }

                        </button>

                    </form>

                </div>

            </section>
              {/* 7. FOOTER */}
            <Footer />

        </div>

    );

}

export default Contact;

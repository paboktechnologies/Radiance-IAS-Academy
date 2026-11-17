
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import "./Home.css";
import API_URL from "../api";

import AboutImage from "../assets/home.avif";
import Student1 from "../assets/Bagavathi.png";
import Student2 from "../assets/Sabitha.png";
import Student3 from "../assets/Ganesh.png";
import Student4 from "../assets/Sajith.png";
import Student5 from "../assets/Poonkulali.png";
import Student6 from "../assets/Bevinal.png";
import Student7 from "../assets/Paneer Selvan.png";
import Student8 from "../assets/Sofia.png";
import Student9 from "../assets/Vadivelan.png";
import Student10 from "../assets/Balakrishnan.png";
import Student11 from "../assets/Alwin.png";
import Student12 from "../assets/Saraswathi.png";
import Student13 from "../assets/Viju.png";
import Student14 from "../assets/Vanitha.png";
import Student15 from "../assets/Siva Prakasam.png";
import Student16 from "../assets/Macklin.png";
import Student17 from "../assets/Subbalakshmi.png";
import Student18 from "../assets/Prasath.png";
import Student19 from "../assets/Mahalingam.png";
import Student20 from "../assets/Siva Magesh.png";


// Convert Google Drive sharing URL into Direct Image URL
const getImageUrl = (url) => {
    if (!url) return "";

    try {
        const parsedUrl = new URL(url);

        if (parsedUrl.hostname.includes("drive.google.com")) {
            const fileId =
                parsedUrl.pathname.match(/\/file\/d\/([^/]+)/)?.[1] ||
                parsedUrl.searchParams.get("id");

            if (fileId) {
                return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
            }
        }

        return url;

    } catch (error) {
        console.error("Invalid image URL:", error);
        return "";
    }
};

function Home() {

    // Advertisement States
    const [popups, setPopups] = useState([]);
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    // Course States
    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Current Advertisement
    const popup = popups[currentPopupIndex] || null;

    //Feedback state
    const [visibleFeedbacks, setVisibleFeedbacks] = useState(4);

    // Static Student Feedback Data
    const studentFeedbacks = [
        {
            id: 1,
            name: "Bagavathi",
            image: Student1,
            feedback:
                "I was preparing for group-2 exam and i was referred to join Radiance IAS Academy by my friend who succeeded in getting a govt job.. She studied in this institute... i recently joined as SUB REGISTRAR and i am happy with the coaching which they are providing, faculties are good and professional.. i am happy that i chose Radiance IAS Academy."
        },
        {
            id: 2,
            name: "Sabitha",
            image: Student2,
            feedback:
                "At the right time, i joined here to get my service in government. My observation is that the teachers are not only teaching their portions, but also sharing quality informations like way of studying, time managment, regular updations etc. Feeling great to study here."
        },
        {
            id: 3,
            name: "Ganesh",
            image: Student3,
            feedback:
                "Glad to share that I have joined in Radiance Academy and getting planned &amp; proper coaching from here. Now I am in a right path, bze apart from quality teaching I am also getting informations about way of..."
        },
        {
            id: 4,
            name: "Sajith (SBI)",
            image: Student4,
            feedback:
                "Best coaching centre . excellent coaching and experience &amp; friendly staff .. best institute for Banking.."
        },
        {
            id: 5,
            name: "Poonkulali",
            image: Student5,
            feedback:
                "Excellent coaching with proper class and test schedule. Provided with good study materials. Periodical test paper discussion with valuable comments."
        },
        {
            id: 6,
            name: "Bevinal",
            image: Student6,
            feedback:
                "I  cleared gr 4 , gr2 , vao , gr2 ( interview ) with the guidance of this academy. Excellent guidance and great coaching thanks u for all..."
        },
        {
            id: 7,
            name: "Paneer Selvan( VAO –State 7 th Rank)",
            image: Student7,
            feedback:
                "I think one of the academy in Nagercoil highlights are the classes taken by excellent faculties, periodically revised material according to the syllabus and current affairs,regular test and weekly full test"
        },
        {
            id: 8,
            name: "Sofia (TNTET)",
            image: Student8,
            feedback:
                "Best academy one can rely on to get a job in TET competitive exam.regular classes,tests conducted,sticks to the schedule,individual care , motivation &amp; staff friendly."
        },
        {
            id: 9,
            name: "Vadivelan",
            image: Student9,
            feedback:
                "I have heared about this Radiance acadamy, an excellent coaching centre for younger citizens of India, run by an experticed coacher Mr.Regu wish to join and let my dreams come true"
        },
        {
            id: 10,
            name: "Balakrishnan (Police dept)",
            image: Student10,
            feedback:
                "I thank Radiance IAS academy ...with my humble respect. Becz now I am in sub inspector police law ana order. Super regu sir...."
        },
         {
            id: 11,
            name: "Alwin",
            image: Student11,
            feedback:
                "Best TNPSC coaching academy In Kanyakumari Dist.  Individual attention &amp; staff friendly will be there. Sure i get service in any group-2 interview post of Vigilance dept. Inspirational faculties."
        },
         {
            id: 12,
            name: "Saraswathi",
            image: Student12,
            feedback:
                "Excellent coaching, best study materials.proper assigned test evaluated by efficient persons.proud to be a student of Radiance ias academy."
        },
         {
            id: 13,
            name: "Viju",
            image: Student13,
            feedback:
                "My dream govt job... I couldn't get many years...But it happened one day.. Because of my Guru Mr.Regu sir..without him I can&#39;t ...."
        },
        {
            id: 14,
            name: "Vanitha",
            image: Student14,
            feedback:
                "If u don't know how to and where to put ur dream of career; just u have to put it into the Radiance IAS academy. here u will achieve ur dream. before I was going so many coaching centre, but..."
        },
        {
            id: 15,
            name: "Sivaprakasam",
            image: Student15,
            feedback:
                "Honestly good Academy. I clear group 2 exam very first attempt. Thank u regu sir"
        },
         {
            id: 16,
            name: "Macklin",
            image: Student16,
            feedback:
                "Very good coaching academy, worth to study here, excellent. thanks sir"
        },
         {
            id: 17,
            name: "Subbulakshmi",
            image: Student17,
            feedback:
                "Best coaching centre . excellent coaching and experience staff .. best institute for tnpsc.."
        },
         {
            id: 18,
            name: "Prasath (Ex Serviceman)",
            image: Student18,
            feedback:
                "Excellent coaching !!! very experienced staff best academy I ever seen"
        },
        {
            id: 19,
            name: "Mahalingam (RAILWAY)",
            image: Student19,
            feedback:
                "Super really fantastic academy...now i am studying group II mains"
        },
        {
            id: 20,
            name: "Siva Magesh",
            image: Student20,
            feedback:
                "I thank god to show this academy.now i working as a Govt staff."
        },
       
    ];

    // Fetch Advertisements and Latest Courses
    useEffect(() => {

        const fetchHomeData = async () => {

            // 1. Fetch All Active Advertisements
            try {
                const popupResponse = await fetch(`${API_URL}/popups`);

                if (!popupResponse.ok) {
                    throw new Error("Unable to fetch popups");
                }

                const popupData = await popupResponse.json();

                if (
                    popupData.success &&
                    Array.isArray(popupData.popups) &&
                    popupData.popups.length > 0
                ) {
                    setPopups(popupData.popups);
                    setCurrentPopupIndex(0);
                    setShowPopup(true);
                }

            } catch (error) {
                console.error("Popup Fetch Error:", error);
            }

            // 2. Fetch Latest Courses
            try {
                const courseResponse = await fetch(`${API_URL}/courses`);

                if (!courseResponse.ok) {
                    throw new Error("Unable to fetch courses");
                }

                const courseData = await courseResponse.json();

                if (
                    courseData.success &&
                    Array.isArray(courseData.courses)
                ) {
                    setCourses(courseData.courses.slice(0, 3));
                }

            } catch (error) {
                console.error("Courses Fetch Error:", error);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchHomeData();

    }, []);

    // 3. Automatically Change Advertisement Every 5 Seconds
    useEffect(() => {

        if (!showPopup || popups.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentPopupIndex((previousIndex) => {
                return (previousIndex + 1) % popups.length;
            });
        }, 5000);

        return () => clearInterval(interval);

    }, [showPopup, popups.length, currentPopupIndex]);

    // Previous Advertisement
    const showPreviousPopup = () => {
        setCurrentPopupIndex((previousIndex) => {
            return (
                previousIndex - 1 + popups.length
            ) % popups.length;
        });
    };

    // Next Advertisement
    const showNextPopup = () => {
        setCurrentPopupIndex((previousIndex) => {
            return (previousIndex + 1) % popups.length;
        });
    };

    return (

        <main className="home-page">

            {/* 1. HERO SECTION */}
            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-tag">
                        WELCOME TO RADIANCE IAS ACADEMY
                    </span>

                    <h1>
                        DREAM.
                        <br />
                        PREPARE.
                        <br />
                        <span>ACHIEVE.</span>
                    </h1>

                    <p>
                        Your journey towards success begins here.
                        Get expert guidance, quality coaching and
                        dedicated mentorship to achieve your goals.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/courses" className="hero-primary-btn">
                            Explore Courses
                        </Link>

                        <Link to="/contact" className="hero-secondary-btn">
                            Contact Us
                        </Link>

                    </div>

                </div>
            </section>

           {/* 2. ABOUT US SECTION */}
<section className="about-section">

    {/* ABOUT MAIN CONTENT */}
    <div className="about-main-container">

        {/* LEFT SIDE - IMAGE */}
        <div className="about-image">

           <img
    src={AboutImage}
    alt="Radiance IAS Academy"
    onError={(e) => {
        e.currentTarget.style.display = "none";
    }}
/>

            <div className="about-image-label">
                <span>ESTABLISHED</span>
                <strong>2010</strong>
                <p>Years of Educational Excellence</p>
            </div>

        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="about-content">

            <span className="section-tag">
                ABOUT US
            </span>

            <h2>
                Empowering Aspirants
                <span> Since 2010</span>
            </h2>

            <p>
                Radiance IAS Academy was established in 2010 by eminent
                academicians and educationists with a vision to provide
                quality education and excellent guidance to aspiring students.
            </p>

            <p>
                We offer comprehensive coaching for UPSC, TNPSC, Banking,
                SSC, Railway, TET/TRB, TNUSRB and other competitive
                examinations. We also provide special coaching programmes
                for school and college students, including NEET, JEE and
                foundation courses.
            </p>

            <p>
                Our academy provides a hi-tech digital classroom environment,
                experienced faculty and online classes and examinations.
                Students can access our learning programmes from anywhere,
                making quality education convenient and accessible.
            </p>

            <p>
                Located in the culturally rich district of Kanyakumari,
                Radiance IAS Academy is committed to providing a supportive
                learning environment, quality infrastructure and continuous
                guidance to help every student achieve their goals.
            </p>

            <div className="about-highlight">
                <h3>Dream Big... We Help You To Achieve It!</h3>
                <p>
                    Building knowledge, confidence and successful futures.
                </p>
            </div>

        </div>

    </div>

    {/* VISION AND MISSION */}
    <div className="about-vision-mission">

        {/* VISION */}
        <div className="vision-card">

            <div className="about-card-icon">
                <span>01</span>
            </div>

            <h3>Our Vision</h3>

            <p>
                To provide education that transforms ideas into action,
                opportunities into global advantages, capabilities into
                successful careers and dreams into realities.
            </p>

        </div>

        {/* MISSION */}
        <div className="mission-card">

            <div className="about-card-icon">
                <span>02</span>
            </div>

            <h3>Our Mission</h3>

            <p>
                Radiance IAS Academy is committed to delivering the best
                possible educational experience and learning opportunities,
                maintaining high educational standards and guiding every
                student towards achieving their future goals.
            </p>

        </div>

    </div>

</section>

     

            {/* 3. LATEST COURSES SECTION */}
            <section className="courses-section">

                <div className="section-heading">

                    <span className="section-tag">
                        OUR COURSES
                    </span>

                    <h2>Choose Your Goal</h2>

                    <p>
                        Find the right course and begin your preparation
                        with expert guidance.
                    </p>

                </div>

                {loadingCourses ? (

                    <p className="home-message">
                        Loading courses...
                    </p>

                ) : courses.length === 0 ? (

                    <p className="home-message">
                        Courses will be announced soon.
                    </p>

                ) : (

                    <div className="course-grid">

                        {courses.map((course) => (

                            <article
                                className="course-card"
                                key={course._id}
                            >

                                <div className="home-course-name-design">

                                    <span className="home-course-academy-name">
                                        RADIANCE IAS ACADEMY
                                    </span>

                                    <h3>{course.title}</h3>

                                    <span className="home-course-label">
                                        COACHING PROGRAM
                                    </span>

                                </div>

                                <div className="course-card-content">
                                    <p>{course.description}</p>
                                </div>

                            </article>

                        ))}

                    </div>

                )}

                <div className="center-button">

                    <Link to="/courses" className="section-btn">
                        View All Courses
                    </Link>

                </div>

            </section>


            {/* 5. STUDENT FEEDBACK */}
<section className="student-feedback-section">

    <div className="section-heading">

        <span className="section-tag">
            STUDENT TESTIMONIALS
        </span>

        <h2>What Our Students Say</h2>

        <p>
            Hear about the learning experience and
            guidance at Radiance IAS Academy.
        </p>

    </div>

    <div className="student-feedback-grid">

        {studentFeedbacks
            .slice(0, visibleFeedbacks)
            .map((student) => (

                <article
                    className="student-feedback-card"
                    key={student.id}
                >

                    <div className="feedback-student-info">

                        <img
                            src={student.image}
                            alt={student.name}
                            className="feedback-student-image"
                            onError={(e) => {
                                e.currentTarget.style.display = "none";
                            }}
                        />

                        <div>
                            <h3>{student.name}</h3>
                            <p>{student.exam || ""}</p>
                        </div>

                    </div>

                    <div className="feedback-quote">
                        “
                    </div>

                    <p className="feedback-text">
                        {student.feedback}
                    </p>

                </article>

            ))}

    </div>

    {/* LOAD MORE BUTTON */}
    {visibleFeedbacks < studentFeedbacks.length && (

        <div className="feedback-load-more">

            <button
                type="button"
                onClick={() => {
                    setVisibleFeedbacks((prev) => prev + 4);
                }}
            >
                Load More
            </button>

        </div>

    )}

</section>

            {/* 6. CONTACT CALL TO ACTION */}
            <section className="home-cta">

                <h2>
                    Your Success Journey Starts Today!
                </h2>

                <p>
                    Take the first step towards your dream career.
                    Connect with Radiance IAS Academy.
                </p>

                <Link to="/contact" className="cta-btn">
                    Enquire Now
                </Link>

            </section>

            {/* 7. FOOTER */}
            <Footer />

            {/* 8. AUTOMATIC ADVERTISEMENT SLIDER */}
            {showPopup && popup && (

                <div className="popup-overlay">

                    <div className="admission-popup">

                        {/* Close Button */}
                        <button
                            type="button"
                            className="popup-close"
                            onClick={() => setShowPopup(false)}
                            aria-label="Close advertisement"
                        >
                            ×
                        </button>

                        {/* Advertisement Image */}
                        {popup.image && (

                            <img
                                key={popup._id}
                                src={getImageUrl(popup.image)}
                                alt={popup.title || "Radiance IAS Academy Advertisement"}
                                className="popup-image-frame"
                                onError={(e) => {
                                    console.error("Popup image could not be loaded:", popup.image);
                                    e.currentTarget.style.display = "none";
                                }}
                            />

                        )}

                        {/* Advertisement Content */}
                        <div className="popup-ad-content">

                            <span className="popup-ad-label">
                                RADIANCE IAS ACADEMY
                            </span>

                            <h2>{popup.title}</h2>

                            {popup.description && (
                                <p>{popup.description}</p>
                            )}

                            {/* Advertisement Navigation */}
                            {popups.length > 1 && (

                                <div className="popup-navigation">

                                    <button
                                        type="button"
                                        onClick={showPreviousPopup}
                                        aria-label="Previous advertisement"
                                    >
                                        ❮
                                    </button>

                                    <span>
                                        {currentPopupIndex + 1} / {popups.length}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={showNextPopup}
                                        aria-label="Next advertisement"
                                    >
                                        ❯
                                    </button>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </main>
    );
}

export default Home;


import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="main-footer">

            <div className="footer-container">

                {/* Academy Information */}
                <div className="footer-about">

                    <h2>RADIANCE IAS ACADEMY</h2>

                    <div className="footer-line"></div>

                    <p className="footer-tagline">
                        Empowering Aspirants. Building Futures.
                    </p>

                    <p className="footer-description">
                        Your trusted destination for quality coaching,
                        expert guidance and dedicated mentorship.
                        Together, let's move towards success.
                    </p>

                </div>


                {/* Quick Links */}
                <div className="footer-links">

                    <h3>Quick Links</h3>

                    <div className="footer-line"></div>

                    <Link to="/">Home</Link>
                    <Link to="/courses">Our Courses</Link>
                    <Link to="/gallery">Gallery</Link>
                    <Link to="/contact">Contact Us</Link>
                    <Link to="/login">Admin Login</Link>
                    

                </div>


                {/* Full Address */}
                <div className="footer-contact">

                    <h3>Our Address</h3>

                    <div className="footer-line"></div>

                    <p>
                        <strong>Radiance IAS Academy</strong>
                    </p>

                    <p>
                        Ground Floor, No:33, Parvathavardhini St,Old Employment Office Road,Ramavarmapuram,
                        Nagercoil,
                        Kanyakumari District,
                        Tamil Nadu - 629001.
                    </p>

                    <p>
                        <strong>Phone:</strong>
<a href="tel:+919488251744">
    94882 51744
</a>
                    </p>

                </div>

            </div>


            {/* Connect With Us */}
            <div className="footer-social">

                <h3>Connect With Us</h3>

                <div className="social-icons">

                    {/* Call */}
                    <a
                        href="tel:+919876543210"
                        aria-label="Call"
                        title="Call"
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.08 5.18 2 2 0 0 1 5.06 3h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L9 10.94a16 16 0 0 0 4.06 4.06l1.31-1.31a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.72 1.98z"/>
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        title="Instagram"
                    >
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="1" className="icon-fill"/>
                        </svg>
                    </a>

                    {/* Website */}
                    <a
                        href="https://radianceiasacademy.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Website"
                        title="Website"
                    >
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"/>
                            <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>
                        </svg>
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        title="Facebook"
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5v4h3v7h4v-7h3l1-4h-4V7.5c0-.83.67-1.5 1.5-1.5H15z"/>
                        </svg>
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:radiance.ngl@gmail.com"
                        aria-label="Email"
                        title="Email"
                    >
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2"/>
                            <path d="m3 7 9 6 9-6"/>
                        </svg>
                    </a>

                </div>

            </div>


            {/* Copyright */}
            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} Radiance IAS Academy.
                    All Rights Reserved.
                </p>


            </div>

        </footer>
    );
}

export default Footer;


import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import RadianceLogo from "../assets/RadianceLogo.jpg";

function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();

    // Navbar reference
    const navbarRef = useRef(null);

    // Close menu function
    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Outside click and Escape key handling
    useEffect(() => {

        const handleOutsideClick = (event) => {

            if (
                navbarRef.current &&
                !navbarRef.current.contains(event.target)
            ) {
                closeMenu();
            }
        };

        const handleEscapeKey = (event) => {

            if (event.key === "Escape") {
                closeMenu();
            }
        };

        if (menuOpen) {

            document.addEventListener("pointerdown", handleOutsideClick);
            document.addEventListener("keydown", handleEscapeKey);

        }

        // Cleanup event listeners
        return () => {

            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscapeKey);

        };

    }, [menuOpen]);


    // Page change aana menu close aagum
    useEffect(() => {
        closeMenu();
    }, [location.pathname]);


    return (

        <nav className="navbar" ref={navbarRef}>

            {/* Academy Logo */}
            <div className="navbar-logo">

                <Link to="/" onClick={closeMenu}>
                   <img
    src={RadianceLogo}
    alt="Radiance IAS Academy Logo"
    className="academy-logo"
/>
                </Link>

            </div>


            {/* Hamburger Button */}
            <button
                type="button"
                className={`hamburger-btn ${menuOpen ? "active" : ""}`}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={
                    menuOpen
                        ? "Close navigation menu"
                        : "Open navigation menu"
                }
                aria-expanded={menuOpen}
                aria-controls="navbar-menu"
            >

                <span></span>
                <span></span>
                <span></span>

            </button>


            {/* Navigation Links */}
            <div
                id="navbar-menu"
                className={`navbar-links ${menuOpen ? "show-menu" : ""}`}
            >

                <Link
                    to="/"
                    className={
                        location.pathname === "/" ? "active-link" : ""
                    }
                    onClick={closeMenu}
                >
                    Home
                </Link>

                <Link
                    to="/courses"
                    className={
                        location.pathname === "/courses" ? "active-link" : ""
                    }
                    onClick={closeMenu}
                >
                    Courses
                </Link>

                <Link
                    to="/gallery"
                    className={
                        location.pathname === "/gallery" ? "active-link" : ""
                    }
                    onClick={closeMenu}
                >
                    Gallery
                </Link>

                <Link
                    to="/contact"
                    className={
                        location.pathname === "/contact" ? "active-link" : ""
                    }
                    onClick={closeMenu}
                >
                    Contact
                </Link>

                

            </div>

        </nav>

    );
}

export default Navbar;

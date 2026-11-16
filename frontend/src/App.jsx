
import {
    BrowserRouter,
    Routes,
    Route,
    Outlet
} from "react-router-dom";

import { useEffect } from "react";

// Public Navbar
import Navbar from "./components/Navbar";

// Admin Route Protection
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Public Pages
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminPopups from "./pages/admin/AdminPopups";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminGallery from "./pages/admin/AdminGallery";

// Public Website Layout
function PublicLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

// Admin Layout
function AdminLayout() {
    return <Outlet />;
}

function App() {

    // Disable Right Click
    useEffect(() => {
        const disableRightClick = (event) => {
            event.preventDefault();
        };

        document.addEventListener("contextmenu", disableRightClick);

        return () => {
            document.removeEventListener("contextmenu", disableRightClick);
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>

                {/* Public Website */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/courses"
                        element={<Courses />}
                    />

                    <Route
                        path="/courses/:id"
                        element={<CourseDetails />}
                    />

                    <Route
                        path="/gallery"
                        element={<Gallery />}
                    />

                    <Route
                        path="/contact"
                        element={<Contact />}
                    />
                </Route>

                {/* Admin Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Admin Pages */}
                <Route element={<ProtectedAdminRoute />}>
                    <Route element={<AdminLayout />}>

                        <Route
                            path="/admin/dashboard"
                            element={<AdminDashboard />}
                        />

                        <Route
                            path="/admin/courses"
                            element={<AdminCourses />}
                        />

                        <Route
                            path="/admin/popups"
                            element={<AdminPopups />}
                        />

                        <Route
                            path="/admin/enquiries"
                            element={<AdminEnquiries />}
                        />

                        <Route
                            path="/admin/gallery"
                            element={<AdminGallery />}
                        />

                    </Route>
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;

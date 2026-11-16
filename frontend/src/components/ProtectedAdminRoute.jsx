
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function ProtectedAdminRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyAdmin = async () => {
            const token = localStorage.getItem("radianceAdminToken");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_URL}/admin/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("radianceAdminToken");
                }
            } catch (error) {
                console.error("Admin verification failed:", error);
                localStorage.removeItem("radianceAdminToken");
            } finally {
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    if (loading) {
        return <div style={{ textAlign: "center", padding: "50px" }}>
            Verifying Admin...
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export default ProtectedAdminRoute;

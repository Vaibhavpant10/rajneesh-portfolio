import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isDemoAdmin = typeof window !== "undefined" && localStorage.getItem("demo_admin") === "true";
  if (!isDemoAdmin) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

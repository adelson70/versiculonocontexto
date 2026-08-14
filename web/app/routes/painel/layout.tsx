import { Navigate, Outlet } from "react-router";
import Sidebar from "../../components/Sidebar";

export default function PainelLayout() {
  const auth = false;

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
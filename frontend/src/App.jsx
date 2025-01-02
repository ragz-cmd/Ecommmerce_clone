import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import LoadingSpinner from "./components/LoadingSpinner";
function App() {
  const { user, checkAuth, checkingAuth } = useUserStore();
  useEffect(() => {
    checkAuth(user);
  }, [checkAuth]);
  if (checkingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full  bg-gradient-to-t from-slate-300 to-slate-50" />
        </div>
      </div>
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/signUp"
            element={user ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/dashboard-admin"
            element={user?.role === "admin" ? <Admin /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

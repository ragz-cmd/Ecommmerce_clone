import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/userStore";
const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-slate-300 bg-opacity-90 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-stone-400">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-between items-center">
          <Link
            to={"/"}
            className="text-2xl font-medium text-slate-800 space-x-2 flex items-center font-montserrat"
          >
            E-commerce
          </Link>
          <nav className="flex flex-wrap items-center gap-4">
            <Link
              to={"/"}
              className="text-stone-900 font-medium hover:text-stone-500 transition duration-300 ease-in-out text-base font-montserrat py-2"
            >
              Home
            </Link>
            {user && (
              <Link
                to={"/cart"}
                className="relative group font-medium font-montserrat text-stone-900 hover:text-stone-500 transition duration-300 ease-in-out text-base py-2"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-stone-500"
                  size={18}
                />
                <span className="hidden sm:inline">Cart</span>

                <span
                  className="absolute -top-2 -left-2 bg-slate-700 text-white rounded-full px-2 py-0.5 
                text-xs group-hover:bg-slate-400 transition duration-300 ease-in-out"
                >
                  3
                </span>
              </Link>
            )}
            {isAdmin && (
              <Link
                className="bg-gray-700 hover:bg-gray-500 text-white text-sm px-3 py-2 rounded-md font-medium
            transition duration-300 ease-in-out flex items-center"
                to={"/dashboard-admin"}
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-gray-700 hover:bg-gray-500 text-white text-sm py-2 px-3 rounded-md flex items-center transition duration-300 ease-in-out font-medium"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <>
                <Link
                  to={"/signup"}
                  className="bg-slate-900 hover:bg-slate-500 text-white text-sm py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to={"/login"}
                  className="bg-stone-700 hover:bg-stone-600 text-white text-sm py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

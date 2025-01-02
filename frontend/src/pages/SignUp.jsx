import { useState } from "react";
import {
  UserPlus,
  Loader,
  Lock,
  ArrowRight,
  User,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserStore } from "../store/userStore";

const SignUp = () => {
  const { signUp, loading, checkingAuth } = useUserStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    signUp(formData);
    if (!checkingAuth) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6  font-montserrat text-center text-3xl font-extrabold text-slate-700">
          Create your account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-400 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-black" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="text-black font-medium block w-full px-3 py-2 pl-10 bg-slate-100 border border-slate-200 rounded-md shadow-sm
                 placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-black" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="text-black font-medium block w-full px-3 py-2 pl-10 bg-slate-100 border border-slate-200 rounded-md shadow-sm
                 placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="mt-1 relative rounded-md shadow-sm">
              {/* Lock Icon on the Left */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-black" aria-hidden="true" />
              </div>

              {/* Password Input */}
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="text-black font-medium block w-full px-3 py-2 pl-10 pr-10 bg-slate-100 border border-slate-200 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                placeholder="******"
              />

              {/* Eye Icon on the Right */}
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                // Ensure the cursor remains consistent
              >
                {showPassword ? (
                  <Eye
                    className="h-5 w-5 text-gray-600 hover:text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <EyeOff
                    className="h-5 w-5  text-gray-600 hover:text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                {/* Lock Icon on the Left */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-black" aria-hidden="true" />
                </div>

                {/* Confirm Password Input */}
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="text-black font-medium block w-full px-3 py-2 pl-10 pr-10 bg-slate-100 border border-slate-200 rounded-md shadow-sm
        placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="******"
                />

                {/* Eye Icon on the Right */}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye
                      className="h-5 w-5  text-gray-600 hover:text-gray-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOff
                      className="h-5 w-5  text-gray-600 hover:text-gray-400"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white bg-slate-600
             hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-slate-500 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-slate-700 hover:text-slate-500"
            >
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;

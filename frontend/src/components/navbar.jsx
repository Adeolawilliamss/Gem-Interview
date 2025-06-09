import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const res = await axios.get("https://gem-interview.onrender.com/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === "success") {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error(
          "⚠️ Auth fetch failed:",
          error.response?.data || error.message
        );
        setIsAuthenticated(false);
      }
    };

    fetchUser();
  }, []);

  // Animation Variants
  const menuVariants = {
    hidden: { opacity: 0, y: "-100%" },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: { opacity: 0, y: "-100%", transition: { duration: 0.4 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <nav id="Navbar" className="bg-white shadow px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="relative overflow-hidden group">
          <div className="block text-xl font-bold border-4 border-blue-600 text-blue-600 px-4 py-2">
            MyLMS
          </div>
          <div className="absolute inset-0 bg-blue-600 text-xl font-bold text-white flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300">
            MyLMS
          </div>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link to="#" className="text-gray-700 hover:text-blue-600">
            Online Degrees
          </Link>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-red-500 font-semibold hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/signup"
                className="text-blue-500 font-semibold hover:text-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobileMenu"
            className="fixed inset-0 bg-blue-600 text-white z-20 flex flex-col items-center justify-center gap-8 text-xl font-semibold"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <button
              onClick={toggleMenu}
              className="absolute top-4 right-4 text-white"
            >
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {[
              "Explore Roles",
              "Explore Categories",
              "Earn a professional Certificate",
              "Earn an Online Degree",
              "Contact",
              isAuthenticated ? "Logout" : "Login",
            ].map((section) =>
              section === "Logout" ? (
                <motion.button
                  key={section}
                  onClick={handleLogout}
                  variants={itemVariants}
                  className="text-white"
                >
                  {section}
                </motion.button>
              ) : (
                <motion.a
                  key={section}
                  href={`#${section}`}
                  variants={itemVariants}
                  className="text-white"
                >
                  {section}
                </motion.a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

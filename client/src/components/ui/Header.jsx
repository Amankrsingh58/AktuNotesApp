import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../AppIcon";
import Button from "./Button";
import { useCart } from "../../contexts/CartContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useLogoutMutation as useAdminLogoutMutation } from "../../store/api/authApi";
import { useLogoutMutation as useUserLogoutMutation } from "../../features/user/userApi";
import { clearAuth } from "../../store/slices/authSlice";
import { clearUserAuth } from "../../store/slices/userSlice";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isUserAuthenticated = useSelector((state) => state.userAuth.isUserAuthenticated);
  const userInfo = useSelector((state) => state.userAuth.userInfo);

  const [adminLogout] = useAdminLogoutMutation();
  const [userLogout] = useUserLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      if (isAuthenticated) {
        await adminLogout().unwrap();
        dispatch(clearAuth());
        navigate("/admin-login");
      } else if (isUserAuthenticated) {
        await userLogout().unwrap();
        dispatch(clearUserAuth());
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout failed", err);
      // Fallback: clear state anyway if network fails
      dispatch(clearAuth());
      dispatch(clearUserAuth());
      navigate("/login");
    }
  };



  function useLinkClickHandler(e) {
    if (e === '/home') {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 10);
  //    window.addEventListener("scroll", onScroll);
  //     return () => window.removeEventListener("scroll", onScroll); }, []);

       useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

       useEffect(() => { document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset"; 
        return () => (document.body.style.overflow = "unset"); }, [isMobileMenuOpen]);

  const navigationItems = [
    { path: "/home", label: "Home", icon: "Home" },
    { path: "/articles", label: "Articles", icon: "Layout" },
    { path: "/notes/years", label: "B.Tech Notes", icon: "BookOpen" },
    { path: "/pyq/semesters", label: "AKTU PYQs", icon: "FileText" },
    // { path: "/interview-questions", label: "Interview Notes", icon: "BookOpen" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] bg-card transition-all duration-200 ${isScrolled ? "shadow-md" : ""
          }`}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* LOGO */}

            <Link to="/home" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <Icon
                  name="GraduationCap"
                  size={24}
                  className="text-primary"
                />
              </div>
              <span className="text-xl font-semibold text-foreground"
              // onClick={() => {window.scrollTo({ top: 0, behavior: "smooth" });}}
              >
                AKTUNotes
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  onClick={useLinkClickHandler(item.path)}
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActivePath(item.path)
                      ? "text-primary"
                      : "text-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={item.icon} size={18} />
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-muted cursor-pointer ">
                <Icon name="Search" size={20} className="text-foreground" />
              </button>

              <Link
                to="/cart"
                className="relative p-2 cursor-pointer  rounded-lg hover:bg-muted "
              >
                <Icon
                  name="ShoppingCart"
                  size={20}
                  className="text-foreground"
                />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted"
              >
                <Icon
                  name={theme === "dark" ? "Sun" : "Moon"}
                  size={20}
                  className="text-foreground cursor-pointer "
                />
              </button>

              <div className="hidden sm:flex items-center gap-2">
               {(!isAuthenticated && !isUserAuthenticated) && <Button variant="ghost" size="sm"
                onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>}
                 {(isAuthenticated || isUserAuthenticated) && <Button variant="outline" size="sm"
          onClick={() => handleLogout()}
          >
              Sign Out
            </Button>}
                <Button variant="default" size="sm"
                  onClick={() =>
                    navigate(isAuthenticated ? "/admin-dashboard" : (isUserAuthenticated ? "/profile" : "/signup"))
                  }                >
                  {isAuthenticated ? "Dashboard" : (isUserAuthenticated ? "My Profile" : "Get Started")}
                </Button>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted"
              >
                <Icon
                  name={isMobileMenuOpen ? "X" : "Menu"}
                  size={24}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[1040] bg-card transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
          aria-label="Close menu"
        >
          <Icon name="X" size={24} className="text-foreground" />
        </button>
        <div className="pt-20 px-4 pb-6 flex flex-col h-full">
          <nav className="flex flex-col gap-2 mb-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${isActivePath(item.path)
                    ? "text-primary"
                    : "text-foreground hover:bg-muted"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    size={20}
                    className="text-foreground"
                  />
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pt-6 border-t border-border">
          {(!isAuthenticated && !isUserAuthenticated) && <Button variant="outline" fullWidth
          onClick={() => navigate("/login")}
          >
              Sign In
            </Button>}
          {(isAuthenticated || isUserAuthenticated) && <Button variant="outline" fullWidth
          onClick={() => handleLogout()}
          >
              Sign Out
            </Button>}
            <Button variant="default" fullWidth
              onClick={() =>
                navigate(isAuthenticated ? "/admin-dashboard" : (isUserAuthenticated ? "/profile" : "/signup"))
              }
            >
              {isAuthenticated ? "Dashboard" : (isUserAuthenticated ? "My Profile" : "Get Started")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

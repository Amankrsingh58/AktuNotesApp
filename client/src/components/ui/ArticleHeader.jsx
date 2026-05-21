import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../AppIcon";
import Button from "./Button";
import { useTheme } from "../../contexts/ThemeContext";
import { useLogoutMutation as useUserLogoutMutation } from "../../features/user/userApi";
import { clearUserAuth, openAuthModal } from "../../store/slices/userSlice";

const ArticleHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();

  const searchParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Update URL param without refreshing (or navigate to /articles if not there)
    if (location.pathname !== "/articles") {
      navigate(`/articles?q=${encodeURIComponent(value)}`);
    } else {
      const newParams = new URLSearchParams(location.search);
      if (value) {
        newParams.set("q", value);
      } else {
        newParams.delete("q");
      }
      navigate({ search: newParams.toString() }, { replace: true });
    }
  };

  const isUserAuthenticated = useSelector((state) => state.userAuth.isUserAuthenticated);
  const [userLogout] = useUserLogoutMutation();

  const handleLogout = async () => {
    try {
      await userLogout().unwrap();
      dispatch(clearUserAuth());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      dispatch(clearUserAuth());
      navigate("/login");
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* ARTICLE HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-card border-b border-border/50 transition-all duration-200">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* LEFT — Logo + Brand */}
            <Link
              to="/articles"
              className="flex items-center gap-2.5 no-underline shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Newspaper" size={18} className="text-primary" />
              </div>
              <span className="text-lg font-semibold text-foreground tracking-tight">
                Articles
              </span>
            </Link>

            {/* CENTER — Search (desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-9 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            {/* RIGHT — Actions */}
            <div className="flex items-center gap-2">
              {/* Search icon (mobile only) */}
              <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors">
                <Icon name="Search" size={20} className="text-foreground" />
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                <Icon
                  name={theme === "dark" ? "Sun" : "Moon"}
                  size={20}
                  className="text-foreground"
                />
              </button>

              {/* Write button (desktop) */}
              {isUserAuthenticated ? (
                <Link
                  to="/write"
                  className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors no-underline"
                >
                  <Icon name="Edit3" size={16} />
                  <span>Write</span>
                </Link>
              ) : (
                <button
                  onClick={() => dispatch(openAuthModal('signup'))}
                  className="hidden sm:flex items-center gap-2 h-9 px-4 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors border-none cursor-pointer"
                >
                  <Icon name="Edit3" size={16} />
                  <span>Write</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Icon
                  name={isMobileMenuOpen ? "X" : "Menu"}
                  size={22}
                  className="text-foreground"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[1040] bg-card transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
          aria-label="Close menu"
        >
          <Icon name="X" size={24} className="text-foreground" />
        </button>

        <div className="pt-20 px-6 pb-6 flex flex-col h-full">
          {/* Mobile search */}
          <div className="relative mb-6">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-full bg-muted/60 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Mobile nav links */}
          <nav className="flex flex-col gap-1 mb-6">
            <Link
              to="/articles"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all"
            >
              <Icon name="Layout" size={20} />
              Articles
            </Link>
            {isUserAuthenticated ? (
              <Link
                to="/write"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all no-underline"
              >
                <Icon name="Edit3" size={20} />
                Write
              </Link>
            ) : (
              <button
                onClick={() => {
                  dispatch(openAuthModal('signup'));
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-all w-full text-left bg-transparent border-none cursor-pointer"
              >
                <Icon name="Edit3" size={20} />
                Write
              </button>
            )}
            <Link
              to="/home"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted font-medium transition-all"
            >
              <Icon name="Home" size={20} />
              Back to Home
            </Link>
          </nav>

          {/* Mobile bottom actions */}
          <div className="flex flex-col gap-3 pt-6 border-t border-border mt-auto">
            {isUserAuthenticated && (
              <Button variant="outline" fullWidth onClick={handleLogout}>
                Sign Out
              </Button>
            )}
            {!isUserAuthenticated && (
              <Button variant="default" fullWidth onClick={() => navigate("/login")}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticleHeader;

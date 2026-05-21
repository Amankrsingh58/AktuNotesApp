import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Icon from "../AppIcon";
import { useLogoutMutation as useUserLogoutMutation } from "../../features/user/userApi";
import { clearUserAuth } from "../../store/slices/userSlice";

const ArticleSidebar = ({ activeView, setActiveView }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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

  const sidebarItems = [
    { key: "home", icon: "Home", label: "Home" },
    { key: "profile", icon: "User", label: "Profile" },
    { key: "articles", icon: "Layout", label: "Articles" },
  ];

  const handleItemClick = (key) => {
    if (location.pathname !== "/articles") {
      // If we are not on the main articles page, we MUST navigate back to it
      navigate("/articles", { state: { view: key } });
    } else if (setActiveView) {
      // If we are on the main page and have a setter, use it (no redirect)
      setActiveView(key);
    } else {
      // Fallback
      navigate("/articles", { state: { view: key } });
    }
  };

  return (
    <aside className="hidden md:flex flex-col items-center w-[64px] shrink-0 border-r border-border/50 bg-card/50 sticky top-14 h-[calc(100vh-56px)] pt-8 pb-4 justify-between">
      <nav className="flex flex-col items-center gap-1">
        {sidebarItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleItemClick(item.key)}
            title={item.label}
            className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
              activeView === item.key
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon name={item.icon} size={20} />
            {/* Tooltip */}
            <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Bottom — Logout */}
      {isUserAuthenticated && (
        <button
          onClick={handleLogout}
          title="Logout"
          className="group relative w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer"
        >
          <Icon name="LogOut" size={20} />
          <span className="absolute left-full ml-2 px-2 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50">
            Logout
          </span>
        </button>
      )}
    </aside>
  );
};

export default ArticleSidebar;

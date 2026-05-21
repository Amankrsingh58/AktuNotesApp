import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ArticleHeader from "../ui/ArticleHeader";
import ArticleSidebar from "./ArticleSidebar";
import AuthModal from "../ui/AuthModal";

const ArticleLayout = () => {
  const [activeView, setActiveView] = useState("home");
  const location = useLocation();

  // Reset activeView when navigating away from /articles and back
  useEffect(() => {
    if (location.pathname !== "/articles") {
      setActiveView(""); // No view active when on detail/write
    } else if (location.state?.view) {
      setActiveView(location.state.view);
    } else if (!activeView) {
      setActiveView("home");
    }
  }, [location.pathname, location.state]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <AuthModal />
      <ArticleHeader />
      <div className="flex pt-14">
        <ArticleSidebar activeView={activeView} setActiveView={setActiveView} />
        <main className="flex-1 min-w-0">
          <Outlet context={{ activeView, setActiveView }} />
        </main>
      </div>
    </div>
  );
};

export default ArticleLayout;


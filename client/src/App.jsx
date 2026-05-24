import React from "react";
import { useTheme } from "./contexts/ThemeContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import NoteDetails from './pages/notes-details';
import Home from './pages/home/Home';
import Cart from './pages/cart';
import YearNotesList from './pages/branch-notes-list'
import SubjectsByYear from "./pages/subjects-by-year";
import SubjectUnits from "./pages/subject-units/SubjectUnits";
import SubBySemesters from "./pages/sub-by-semesters/SubBySemesters";
import SelectedSubjectDownloads from "./pages/sub-by-semesters/download-links";
import SemesterNotesList from "./pages/semesters";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/protectedRoutes";
import AdminDashboard from "./pages/admin-dashboard/AdminDashboard";
import AuthInit from "./store/slices/AuthInit";
import UserAuthInit from "./store/slices/UserAuthInit";
import AboutUs from "./pages/home/components/AboutUs";
import { Analytics } from "@vercel/analytics/react"
import Vlog from "./pages/blog/Blog";
import InterviewQuestions from "./pages/interview-notes/InterviewNotes";
import PaymentStatus from "./pages/payment-status";
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import MyProfile from "./pages/auth/MyProfile";
import Articles from "./pages/articles/Articles";
import ArticleDetail from "./pages/articles/ArticleDetail";
import CompleteProfile from "./pages/articles/CompleteProfile";
import WriteArticle from "./pages/articles/WriteArticle";
import ArticleLayout from "./components/layout/ArticleLayout";
import ArticleProtectedRoute from "./routes/ArticleProtectedRoute";
import { Toaster } from 'react-hot-toast';
export default function App() {
  return (
    <>
        <Toaster position="top-center" />
        <AuthInit />
        <UserAuthInit />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-login" element={<Login />} />
          <Route path="/login" element={<UserLogin />} />
          
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/profile" element={<MyProfile />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/note-details" element={<NoteDetails />} />
          <Route path="/home" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />

          <Route path="/notes/years" element={<YearNotesList />} />
          <Route path="/notes/year/:year" element={<SubjectsByYear />} />
          <Route path="/year/:year/subject/:subject" element={<SubjectUnits />} />

          <Route path="/pyq/semesters" element={<SemesterNotesList />} />
          <Route path="/pyq/semester-or-year/:year" element={<SubBySemesters />} />
          <Route path="/pyq/semester-or-year/:year/subject/:subject/" element={<SelectedSubjectDownloads />} />

          <Route path="/interview-questions" element={<InterviewQuestions />} />

          <Route path="/blogs" element={<Vlog />} />

          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/status/:merchantTransactionId" element={<PaymentStatus />} />
          
          {/* <Route element={<ArticleProtectedRoute />}>
            <Route element={<ArticleLayout />}>
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
              <Route path="/write" element={<WriteArticle />} />
            </Route>
          </Route> */}
          <Route path="/complete-article-profile" element={<CompleteProfile />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Analytics />
    </>
  );
}


import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initGA } from "./utils/analytics";
import { AnalyticsProvider } from "./context/AnalyticsContext";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Chatbot from "./components/chatbot/Chatbot";

// Pages
import HomePage from "./pages/home/HomePage";
import CausesPage from "./pages/causes/CausesPage";
import CauseDetailsPage from "./pages/causes/CauseDetailsPage";
import CreateCausePage from "./pages/causes/CreateCausePage";
import EditCausePage from "./pages/causes/EditCausePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/ProfilePage";
import MyContributionsPage from "./pages/profile/MyContributionsPage";
import MyFollowedCausesPage from "./pages/profile/MyFollowedCausesPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCausesPage from "./pages/admin/AdminCausesPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import NotFoundPage from "./pages/NotFoundPage";

// Auth components
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";

// Analytics
import PageTracker from "./components/analytics/PageTracker";

// Redux
import { useCheckAuthStatus } from "./hooks/useCheckAuthStatus";

const { Content } = Layout;

const App = () => {
  const { user, isLoading } = useSelector((state) => state.auth); // Check auth status on app load
  useCheckAuthStatus();

  // Initialize Google Analytics on app load
  useEffect(() => {
    initGA();
  }, []);

  // Get Google Client ID from environment variables
  let googleClientId =
    "911777939876-m7dj8bejsovfbid5p2udgdlsh84b6mj3.apps.googleusercontent.com";

  // Directly use the value from .env file as fallback
  if (!googleClientId) {
    googleClientId =
      "911777939876-m7dj8bejsovfbid5p2udgdlsh84b6mj3.apps.googleusercontent.com";
  }

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: "100vh" }}>
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AnalyticsProvider>
        <Router>
          <PageTracker />
          <Layout className="layout">
            <Header />
            <Content className="page-content">
              <div className="container">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/causes" element={<CausesPage />} />
                  <Route path="/causes/:id" element={<CauseDetailsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  {/* Private routes */}
                  <Route element={<PrivateRoute />}>
                    <Route
                      path="/causes/create"
                      element={<CreateCausePage />}
                    />
                    <Route
                      path="/causes/:id/edit"
                      element={<EditCausePage />}
                    />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                      path="/my-contributions"
                      element={<MyContributionsPage />}
                    />
                    <Route
                      path="/followed-causes"
                      element={<MyFollowedCausesPage />}
                    />
                  </Route>{" "}
                  {/* Admin routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/causes" element={<AdminCausesPage />} />
                    <Route
                      path="/admin/categories"
                      element={<AdminCategoriesPage />}
                    />
                  </Route>
                  {/* 404 route */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
            </Content>{" "}
            <Footer /> <Chatbot />
          </Layout>
        </Router>
      </AnalyticsProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminHalls from "./pages/admin/AdminHalls";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminGallery from "./pages/admin/AdminGallery";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import HallsPage from "./pages/HallsPage";
import HallDetailPage from "./pages/HallDetailPage";
import BookingPage from "./pages/BookingPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import PackagesPage from "./pages/PackagesPage";
import GalleryPage from "./pages/GalleryPage";
import AboutPage from "./pages/AboutPage";
import "./App.css";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function App() {
  useEffect(() => {
    // Prevent browser from restoring scroll position (causes auto-scroll-down on load)
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const setupRevealObserver = () => {
      const revealElements = document.querySelectorAll(
        ".reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active), .reveal-scale:not(.active), .reveal-fade:not(.active)"
      );

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );

      revealElements.forEach((el) => observer.observe(el));
      return observer;
    };

    // Initial setup
    let observer = setupRevealObserver();

    // Re-run setup on DOM mutations to capture dynamically rendered content
    const mutationObserver = new MutationObserver(() => {
      observer.disconnect();
      observer = setupRevealObserver();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            {/* ADMIN ROUTES */}
            <Route
              path="/admin"
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/halls"
              element={
                <AdminLayout>
                  <AdminHalls />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <AdminLayout>
                  <AdminContacts />
                </AdminLayout>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <AdminLayout>
                  <AdminGallery />
                </AdminLayout>
              }
            />
            <Route path="/" element={<HomePage />} />
            <Route path="/halls" element={<HallsPage />} />
            <Route path="/halls/:id" element={<HallDetailPage />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/booking-success" element={<BookingSuccessPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Filters from './components/Filters';
import BeforeAfterGallery from './components/BeforeAfterGallery';
import CallToAction from './components/CallToAction';
import ImageSlider from './components/ImageSlider';
import Footer from './components/Footer';
import Loader from './components/Loader';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import AboutUs from './components/AboutUs';
import ProjectsPage from './components/ProjectsPage';
import ServicesPage from './components/ServicesPage';
import ResetMpin from './components/ResetMpin';
import BillingPage from './components/BillingPage';

// Import new footer pages
import { WaterproofingPage, PolyurethaneSealingPage, IndustrialPipingPage, ConstructionPage, InstrumentRepairPage } from './components/ServiceDetailPages';
import { CareersPage, ContactPage, PrivacyPolicyPage, RequestQuotePage } from './components/CompanyPages';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isLoggedIn ? children : <Navigate to="/signup" replace />;
};

// Home Page Component
const HomePage: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (filter: string) => {
    if (filter === activeFilter) return;

    setIsLoading(true);
    setTimeout(() => {
      setActiveFilter(filter);
      setIsLoading(false);
      const contentStart = document.getElementById('content-start');
      if (contentStart) {
        contentStart.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2000);
  };

  return (
    <main className="flex-grow">
      {isLoggedIn && user ? (
        /* Logged In: Show Dashboard */
        <Dashboard user={user} />
      ) : (
        /* Public Guest: Show Landing Page */
        <>
          <Hero />
          <Filters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
          <div id="content-start"></div>

          {isLoading ? (
            <Loader category={activeFilter} />
          ) : (
            <>
              <BeforeAfterGallery activeFilter={activeFilter} />
              <CallToAction />
              <ImageSlider />
            </>
          )}
        </>
      )}
    </main>
  );
};

// App Layout Component
const AppLayout: React.FC = () => {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/billing" element={
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        } />

        {/* Routes with Navbar and Footer */}
        <Route path="*" element={
          <>
            <Navbar isLoggedIn={isLoggedIn} user={user || undefined} />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reset-mpin" element={<ResetMpin />} />

              {/* Public Info Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/careers" element={<CareersPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/request-quote" element={<RequestQuotePage />} />

              {/* Public Service Detail Pages */}
              <Route path="/services/waterproofing" element={<WaterproofingPage />} />
              <Route path="/services/polyurethane" element={<PolyurethaneSealingPage />} />
              <Route path="/services/piping" element={<IndustrialPipingPage />} />
              <Route path="/services/construction" element={<ConstructionPage />} />
              <Route path="/services/instrument-repair" element={<InstrumentRepairPage />} />

              {/* Protected Routes */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/services" element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              } />
            </Routes>

            {/* Footer - conditional rendering */}
            <Routes>
              <Route path="/signup" element={null} />
              <Route path="/login" element={null} />
              <Route path="/reset-mpin" element={null} />
              <Route path="/profile" element={null} />
              <Route path="*" element={<Footer />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
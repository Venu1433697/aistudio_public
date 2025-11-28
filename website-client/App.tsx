import React, { useState, useEffect } from 'react';
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
import BillingPage from './components/BillingPage'; // New import
import { User } from './types';

// Import new footer pages
import { WaterproofingPage, PolyurethaneSealingPage, IndustrialPipingPage, ConstructionPage, InstrumentRepairPage } from './components/ServiceDetailPages';
import { CareersPage, ContactPage, PrivacyPolicyPage, RequestQuotePage } from './components/CompanyPages';

const App: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Auth & View State
  const [currentView, setCurrentView] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

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

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('home'); 
  };

  const handleLogout = () => {
    setUser(undefined);
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  // --- Protected Navigation Handler ---
  const handleNavigation = (view: string) => {
    // Protected Routes: Projects, Services (Main Page)
    // Note: Detailed service pages from footer (e.g., waterproofing) are public for now to allow exploration
    if ((view === 'projects' || view === 'services') && !isLoggedIn) {
      setCurrentView('signup'); 
    } else {
      setCurrentView(view);
    }
  };

  // --- View Rendering Logic ---
  const renderContent = () => {
    if (currentView === 'signup') return <SignUp onNavigate={setCurrentView} onLogin={handleLogin} />;
    if (currentView === 'login') return <Login onNavigate={setCurrentView} onLogin={handleLogin} />;
    
    // Footer & Info Pages (Publicly accessible)
    if (currentView === 'about') return <AboutUs />;
    if (currentView === 'contact') return <ContactPage />;
    if (currentView === 'careers') return <CareersPage />;
    if (currentView === 'privacy') return <PrivacyPolicyPage />;
    if (currentView === 'request-quote') return <RequestQuotePage />;
    
    // Specific Service Detail Pages (Publicly accessible)
    if (currentView === 'waterproofing') return <WaterproofingPage />;
    if (currentView === 'polyurethane') return <PolyurethaneSealingPage />;
    if (currentView === 'piping') return <IndustrialPipingPage />;
    if (currentView === 'construction') return <ConstructionPage />;
    if (currentView === 'instrument-repair') return <InstrumentRepairPage />;

    // Protected Pages
    if (currentView === 'projects') {
      if (!isLoggedIn) return <SignUp onNavigate={setCurrentView} onLogin={handleLogin} />;
      return <ProjectsPage />;
    }

    if (currentView === 'services') {
      if (!isLoggedIn) return <SignUp onNavigate={setCurrentView} onLogin={handleLogin} />;
      return <ServicesPage />;
    }

    // New Route for Reset M-PIN
    if (currentView === 'reset-mpin') {
      return (
         <div className="min-h-screen flex flex-col font-sans bg-white">
            <ResetMpin onNavigate={setCurrentView} userMobile={user?.mobile} />
         </div>
      );
    }

    if (currentView === 'billing' && isLoggedIn) {
        return (
            <div className="min-h-screen flex flex-col font-sans bg-white">
               <Navbar onNavigate={handleNavigation} isLoggedIn={isLoggedIn} user={user} />
               <BillingPage onNavigate={setCurrentView} />
            </div>
        );
    }

    if (currentView === 'profile' && isLoggedIn && user) {
       return (
          <Profile 
             user={user} 
             onLogout={handleLogout} 
             onNavigate={setCurrentView} 
             onUpdateUser={handleUpdateUser} 
          />
       );
    }

    // Default Home/Dashboard View
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
                <CallToAction onNavigate={setCurrentView} />
                <ImageSlider />
              </>
            )}
          </>
        )}
      </main>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Hide main Navbar for Billing page to prevent duplication as per user request, since BillingPage has its own header structure */}
      {currentView !== 'billing' && (
         <Navbar onNavigate={handleNavigation} isLoggedIn={isLoggedIn} user={user} />
      )}
      
      {renderContent()}
      
      {/* Footer logic: Exclude on Auth, Profile, Reset, and Billing pages */}
      {(!['signup', 'login', 'reset-mpin', 'profile', 'billing'].includes(currentView)) && (
        <Footer onNavigate={handleNavigation} />
      )}
    </div>
  );
};

export default App;
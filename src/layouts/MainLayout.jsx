import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollTopButton from '../components/ScrollTopButton';
import PageTransition from '../components/PageTransition';

export default function MainLayout() {
  const location = useLocation();
  useEffect(() => {
  window.scrollTo(0, 0);
}, [location.pathname]);
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="bg-orbs" aria-hidden="true" />
      <Navbar />
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}><Outlet /></PageTransition>
      </AnimatePresence>
      <Footer />
      <ScrollTopButton />
    </>
  );
}

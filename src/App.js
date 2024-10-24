import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Product from './components/Product';
import Footer from './components/Footer';
import ProductPopup from './components/ProductPopup';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage'; 
function App() {
  const [isOpen, setPopupOpen] = useState(false);
  const [animateOnLoad, setAnimateOnLoad] = useState(false); 
  const [isLoading, setIsLoading] = useState(true); 
  useEffect(() => {
    const isFirstVisit = sessionStorage.getItem('firstVisit') === null;
    if (isFirstVisit) {
      sessionStorage.setItem('firstVisit', 'true');
      setAnimateOnLoad(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 4000);
      return () => clearTimeout(timer); 
    } else {
      setIsLoading(false);
    }
  }, []); 
  return (
    <Router>
      {isLoading ? (
        <div className={`loading-screen ${animateOnLoad ? 'blurIn' : ''}`}>
          <h1>Welcome to Ashe</h1>
        </div>
      ) : (
        <div className="App">
          <Navbar setPopupOpen={setPopupOpen} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Product setPopupOpen={setPopupOpen} />
                  <Footer />
                </>
              }
            />
            <Route 
              path="/contact" 
              element={
                <>
                  <ContactPage />
                  <Footer />
                </>
              } 
            />
            <Route 
              path="/about" 
              element={
                <>
                  <AboutPage />
                  <Footer />
                </>
              } 
            />
          </Routes>

          {isOpen && (
            <ProductPopup
              isOpen={isOpen}
              setPopupOpen={setPopupOpen}
            />
          )}
        </div>
      )}
    </Router>
  );
}

export default App;

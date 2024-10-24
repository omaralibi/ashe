import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import logo from '../Images/logotiffany.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const Navbar = ({ setPopupOpen }) => {
  const [productCount, setProductCount] = useState(45);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navbarRef = useRef(null); // Ref for the navbar

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev); // Toggle menu state
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click is outside the menu and the navbar
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        navbarRef.current && !navbarRef.current.contains(event.target) &&
        isMenuOpen
      ) {
        closeMenu(); // Close the menu if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const orderCount = querySnapshot.size;
        setProductCount(45 - orderCount);
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <nav className="navbar" role="navigation" ref={navbarRef}> {/* Add ref here */}
      <div className="navbar-content">
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <Link to="/" className="logo">
          <img src={logo} alt="Logo" />
        </Link>
        {productCount > 0 ? (
          <button className="order-now" onClick={() => setPopupOpen(true)}>
            ORDER NOW
          </button>
        ) : (
          <div className="out-of-stock"></div>
        )}
      </div>

      <div className="navwhendrop">
        <Link to="/" className="logo_resp">
          <img src={logo} alt="Logo" />
        </Link>
        <button
          className="navbar-toggle"
          onClick={toggleMenu} // Toggle menu state
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>
        {isMenuOpen && ( // Render the menu conditionally based on isMenuOpen
          <div className="menu open" ref={menuRef}>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
            {productCount > 0 ? (
              <button className="order-now" onClick={() => setPopupOpen(true)}>
                ORDER NOW
              </button>
            ) : (
              <div className="out-of-stock"></div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

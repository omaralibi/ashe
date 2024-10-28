//footer.js


import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  
  return (
    <footer className="footer">
      <div className='upperf'>
      <div className="social-links">
        <a href="https://www.tiktok.com/@ashe.tn" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faTiktok}  />
        </a>
        <a href="https://instagram.com/ashe.tn" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram}  />
        </a>
      </div>
      <p className='midText'>BE PART OF THE JOURNEY</p>
      <p className='be'>#be_distinct</p></div>

      <p className='copyright'>© 2024 Ashe. All rights reserved. - ashe.tn</p>
    </footer>
  );
}

export default Footer;

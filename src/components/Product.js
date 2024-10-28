import React, { useEffect, useState } from 'react';
import './Product.css';
import image from '../Images/IMGHOLDER.jpg';
import image1 from '../Images/IMGHOLDER1.jpg';
import image2 from '../Images/IMGHOLDER2.jpg';
import image3 from '../Images/IMGHOLDER3.jpg';
import logoblack from '../Images/logoblack.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import heat from '../Images/icons/7.svg';
import bleach from '../Images/icons/14.svg';
import iron from '../Images/icons/18.svg';
import dry from '../Images/icons/28.svg';
import tumble from '../Images/icons/35.svg';
import separate from '../Images/icons/62.svg';

const Product = ({ setPopupOpen }) => {
  const initialCount = 45;
  const [count, setCount] = useState(initialCount);
  const [digits, setDigits] = useState(initialCount.toString().split('').map(Number));
  const [isExpanded, setIsExpanded] = useState(false);
  const images = [image, image1, image2, image3];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const orderCount = querySnapshot.size;
        const calculatedFinalCount = initialCount - orderCount;
        let currentCount = initialCount;
        const countdownInterval = setInterval(() => {
          if (currentCount > calculatedFinalCount) {
            currentCount -= 1;
            setCount(currentCount);
            setDigits(currentCount.toString().split('').map(Number));
          } else {
            clearInterval(countdownInterval);
          }
        }, 200);

      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, [initialCount]);

  useEffect(() => {
    let imageInterval;
    if (!isExpanded) {
      imageInterval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000); 
    }
    return () => clearInterval(imageInterval);
  }, [isExpanded, images.length]);

  return (
    <div className={`product-showcase ${isExpanded ? 'expanded' : ''}`}>
      <div className={`section1 ${isExpanded ? 'expanded' : ''}`}>
        <h2 className="title">AN INHERITED STORY</h2>
        <h3 className="subtitle">FIRST RELEASE | LIMITED EDITION</h3>
        <div className="product-count">
          <span className="count">
            {digits.map((digit, index) => (
              <span className="digit leBlurIn" key={`${digit}-${index}`}>
                {digit}
              </span>
            ))}
          </span>
          <span className="label">PRODUCTS LEFT</span>
        </div>
        {count > 0 ? (
          <button className="order-now-large" onClick={() => setPopupOpen(true)}>
            ORDER NOW
          </button>
        ) : (
          <div className="out-of-stock">OUT OF STOCK</div>
        )}
      </div>
      
      <div className={`section2 ${isExpanded ? 'expanded' : ''}`}>
        <div className='prix'>Price: 100 TND</div>
        {isExpanded ? (
          <div className="card-container">
            <button className="arrow left-arrow" onClick={handlePrevImage}>❮</button>
            <img
              src={images[currentIndex]}
              alt={`Product ${currentIndex + 1}`}
              className="product-image card"
              style={{ zIndex: 10 - currentIndex }}
            />
            <button className="arrow right-arrow" onClick={handleNextImage}>❯</button>
          </div>
        ) : (
          <img 
            src={images[currentIndex]}
            alt={`Product ${currentIndex + 1}`}
            className="product-image"
            style={{ zIndex: 10 - currentIndex }}
          />
        )}
        
        <div className="button-container">
          <button 
            className="explore-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ opacity: isExpanded ? 0 : 1 }}
          >
            Explore
          </button>
          {isExpanded && (
            <button 
              className="btn-explore-x" 
              onClick={() => setIsExpanded(false)}
              style={{ opacity: 1 }}
            >
              ✖
            </button>
          )}
        </div>
      </div>
      
      <div className={`section3 ${isExpanded ? 'expanded' : ''}`}>
        <div className="container">
          <div className="header">
            <h1>
              45 MINUTES
              <span>QUARTER-ZIP</span>
            </h1>
            <p className="product-info">ASHE’s first product</p>
          </div>
          <div className="content">
            <h2>Composition</h2>
            <p>Fabric: 100% cotton</p>
            <h2>Care Instructions</h2>
            <div className="care-instructions">
            <p><i><img src={separate} alt="separate icon"/></i> Wash separately</p>
              <p><i><img src={bleach} alt="bleach icon"/></i> Bleach prohibited</p>
              <p><i><img src={iron} alt="iron icon"/></i> Iron at max 110°C</p>
              <p><i><img src={dry} alt="dry icon"/></i> Do not dry clean</p>
              <p><i><img src={tumble} alt="tumble icon"/></i> Do not tumble dry</p>
              <p><i><img src={heat} alt="30°C icon"/></i> Machine washable at max 30°C</p>
            </div>
            <h2>Traceability</h2>
            <p>MADE IN TUNISIA.</p>
            <p>This item is handmade by the tailor Hayet Collection.</p>
            <h2>Packaging</h2>
            <p className='packD'>We are rethinking our packaging to reduce the consumption of raw materials, increase recycled content, and unify materials to facilitate their subsequent reuse and recycling.</p>
            <div className='recycle'><p>All our bags, pouches, and boxes are 100% recyclable.</p></div>
          </div>
          <div className="footerInf">
            <img src={logoblack} alt="Logo"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;

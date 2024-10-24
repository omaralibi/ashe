import React, { useEffect, useState } from 'react';
import './Product.css';
import image from '../Images/Asset 1.png';
import logoblack from '../Images/logoblack.png';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 

const Product = ({ setPopupOpen }) => {
  const initialCount = 45; 
  const [count, setCount] = useState(initialCount);
  const [digits, setDigits] = useState(initialCount.toString().split('').map(Number));
  const [isExpanded, setIsExpanded] = useState(false); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders')); 
        const orderCount = querySnapshot.size;
        const calculatedFinalCount = initialCount - orderCount;
        // Start the countdown
        let currentCount = initialCount;
        const countdownInterval = setInterval(() => {
          if (currentCount > calculatedFinalCount) {
            currentCount -= 1;
            setCount(currentCount);
            setDigits(currentCount.toString().split('').map(Number));
          } else {
            clearInterval(countdownInterval); // Stop the countdown when target is reached
          }
        }, 200); // Adjust the speed of the countdown (100ms)

      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
    };

    fetchOrders();
  }, [initialCount]);
  return (
    <div className={`product-showcase ${isExpanded ? 'expanded' : ''}`}>
      <div className={`section1 ${isExpanded ? 'expanded' : ''}`}>
        <h2 className="title">AN INHERITED STORY</h2>
        <h3 className="subtitle">FIRST RELEASE | LIMITED EDITION</h3>
        <div className="product-count">
        <span className="count">
            {digits.map((digit) => (
              <span className="digit leBlurIn" key={`${digit}`}>
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
        <img src={image} alt="Product" className={`product-image ${isExpanded ? 'expanded' : ''}`} />
        <button className={`explore-btn ${isExpanded ? 'btn-explore-x' : ''}`} onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <div className="btn-explore-x">✖</div> : 'Explore'}
        </button>
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
                <p><i className="fas fa-tshirt"></i> Machine washable at max. 30°C</p>
                <p><i className="fas fa-ban"></i> Bleach prohibited</p>
                <p><i className="fas fa-iron"></i> Iron at max. 110°C</p>
                <p><i className="fas fa-times-circle"></i> Do not dry clean</p>
                <p><i className="fas fa-times-circle"></i> Do not tumble dry</p>
                <p><i className="fas fa-exclamation-circle"></i> Wash separately</p>
              </div>
              <h2>Traceability</h2>
              <p>MADE IN TUNISIA.</p>
              <p>This item is handmade by the tailor Hayet Collection.</p>
              <div className='packaging'>
              <h2>Packaging</h2>
              <p>We are rethinking our packaging to reduce the consumption of raw materials, increase recycled content, and unify materials to facilitate their subsequent reuse and recycling.</p>
              <p>All our bags, pouches, and boxes are 100% recyclable.</p>
            </div></div>
            <div className="footerInf">
            <img src={logoblack} alt="Logo"/>
            </div>
          </div>
        </div>
        </div>
  );
};

export default Product;

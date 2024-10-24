import React from 'react';
import './AboutPage.css'; // Import the Swiss-style CSS file
import team from '../Images/ena.jpg';

const AboutPage = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      <p className="about-description">
        Ashe is a brand that focuses on 'old money' clothing, inspired by inherited stories and timeless elegance. 
        We believe in the art of simplicity and sophistication, creating pieces that transcend trends.
      </p>

      <div className="team-section">
        <h2 className="team-title">Meet the Team</h2>
        <div className="team-cards">
          {/* First Team Member */}
          <div className="team-member">
            <div className="card">
              <div className="card-inner">
                <div className="card-front swiss-front">
                  <h3>Omar Alibi</h3>
                  <p>Founder & Creative Director</p>
                </div>
                <div className="card-back swiss-back">
                  <img src={team} alt="Omar Alibi" />
                  <p>Graphic Designer, Web Developer, Video Maker, Operator, Customer Support, Marketing Manager, Community Manager</p>
                </div>
              </div>
            </div>
          </div>

          {/* Second Team Member */}
          <div className="team-member">
            <div className="card">
              <div className="card-inner">
                <div className="card-front swiss-front">
                  <h3>Omar Alibi</h3>
                  <p>Marketing & Strategy</p>
                </div>
                <div className="card-back swiss-back">
                  <img src={team} alt="Omar Alibi" />
                  <p>Graphic Designer, Web Developer, Video Maker, Operator, Customer Support, Marketing Manager, Community Manager</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;

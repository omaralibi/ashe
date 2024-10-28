import React from 'react';
import './AboutPage.css'; 
import ena from '../Images/ena.png';

const AboutUs = () => {
  return (
    <section className="about-us">
      <div className="intro-section">
        <h1 className="headline">Our Story</h1>
        <p className="intro-text">
          Ashe isn’t just a brand; it’s an embodiment of a heritage-driven journey, blending elegance with a personal story.
        </p>
      </div>

      <div className="story-section">
        <h2>Born from Legacy</h2>
        <p>
          At Ashe, we believe in timeless fashion inspired by an inherited legacy, crafted for those who appreciate the finer things in life.
          Every piece is designed to echo the elegance and sophistication that "old money" embodies, redefined through a modern lens.
        </p>
      </div>

      <div className="founder-section">
        <h2>Meet the Founder</h2>
        <img src={ena} alt="Omar Alibi" className="founder-image" />
        <p className="founder-description">
          Omar Alibi, the founder behind Ashe, does it all—from scratch, driven by passion and heritage. Ashe is more than fashion; it’s a story he lives and shares.
        </p>
        <div className="italic">
          <p>“I remember my grandma teaching me the art of sewing.”</p>
        </div>
      </div>

      <div className="mission-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is to create classic, understated clothing that stands the test of time, appealing to those who value authenticity, quality, and the story behind each garment.
        </p>
      </div>


      <div className="cardAU">
        <div className="cta-container">
          <button className="cta-seal">ASHE</button>
          <div className="cta-content">
            <p className="cta-title">Thank You</p>
            <p className="cta-text">It’s so nice that you had the time to read this story.</p>
            <p className="cta-subtext">Wishing you a fantastic day ahead!</p>
            <p className="cta-footer">ASHE</p>
          </div>

          <div className="cta-bg tp"></div>
          <div className="cta-bg lft"></div>
          <div className="cta-bg rgt"></div>
          <div className="cta-bg btm"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

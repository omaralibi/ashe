import React from 'react';
import './AboutPage.css';
import teamImage from '../Images/ena.jpg';
import craftsmanshipImage from '../Images/ena.jpg'; // Add appropriate image paths

const AboutPage = () => {
  const showDetail = (event) => {
    // Logic to show details of the timeline event
    console.log(`Event ${event} details shown!`);
  };

  return (
    <section className="about-section">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to Ashe: Where Tradition Meets Elegance</h1>
        <p>Join Our Journey</p>
      </div>

      {/* Chapter One: The Inspiration */}
      <section className="chapter-one">
        <h2>Our Inspiration</h2>
        <p>
          Every stitch tells a story. Ashe is rooted in the rich tapestry of Tunisian heritage,
          where the past inspires the present.
        </p>
        <div className="inspiration-illustration fade-in">
          {/* Animated illustration goes here */}
        </div>
      </section>

      {/* Chapter Two: The Craftsmanship */}
      <section className="chapter-two">
        <h2>The Craftsmanship</h2>
        <p>
          Handcrafted with love, each piece embodies sophistication and meticulous attention to detail.
        </p>
        <img src={craftsmanshipImage} alt="Craftsmanship" className="craftsmanship-image fade-in" />
        <p className="anecdote">“I remember my grandmother teaching me the art of sewing...”</p>
      </section>

      {/* Chapter Three: The Vision */}
      <section className="chapter-three">
        <h2>Our Vision</h2>
        <p>To create garments that transcend time, blending tradition with modern elegance.</p>

      </section>

      {/* Interactive Timeline */}
      <section className="timeline-section">
        <h2>Our Journey</h2>
        <div className="timeline">
          <div className="timeline-event" onMouseEnter={() => showDetail(1)}>
            <p>2018: Brand Established</p>
          </div>
          <div className="timeline-event" onMouseEnter={() => showDetail(2)}>
            <p>2020: First Collection Launched</p>
          </div>
          {/* Add more timeline events as needed */}
        </div>
        <div className="timeline-detail">
          {/* Dynamic content based on the hovered event */}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Join Our Community</h2>
        <p>Explore our ethos and engage with our story. Watch our interviews and share in our journey.</p>
        <a href="/explore" className="cta-button">Discover More</a>
      </section>
    </section>
  );
};

export default AboutPage;

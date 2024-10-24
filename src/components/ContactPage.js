import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './ContactPage.css';
import { FaPhone, FaEnvelope } from 'react-icons/fa'; // Import icons from react-icons

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        honeypot: '',
        rating: 0, // Include rating in formData
    });
    const [popup, setPopup] = useState({ visible: false, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check the honeypot field to prevent bot submissions
        if (formData.honeypot) {
            console.log('Honeypot field filled. Likely a bot submission.');
            return;
        }

        setIsSubmitting(true); // Disable the button

        emailjs.sendForm(
            process.env.REACT_APP_EMAILJS_SID,   // Replace with your EmailJS service ID
            process.env.REACT_APP_EMAILJS_TID,  // Replace with your EmailJS template ID
            e.target,
            process.env.REACT_APP_EMAILJS_PK  // Replace with your Public Key
        )
        .then((result) => {
            console.log('Email successfully sent!', result.text);
            setPopup({ visible: true, message: "Message sent successfully!" });

            // Reset the form data
            setFormData({ name: '', email: '', message: '', honeypot: '', rating: 0 });

            setTimeout(() => {
                setPopup({ visible: false, message: '' });
                window.location.reload(); // Refresh the page after 3 seconds
            }, 3000); // Popup will disappear after 3 seconds
        })
        .catch((error) => {
            console.log('Failed to send email.', error.text);
            setPopup({ visible: true, message: "Failed to send the message. Please try again later." });

            setTimeout(() => {
                setPopup({ visible: false, message: '' });
                window.location.reload(); // Refresh the page after error message disappears
            }, 3000); // Popup will disappear after 3 seconds
        })
        .finally(() => {
            setIsSubmitting(false); // Re-enable the button
        });
    };

    function StarRating({ rating, onRating }) {
        return (
            <div className="star-rating">
                {[...Array(5)].map((_, i) => {
                    const starValue = i + 1; // Calculate the star value (1 to 5)
                    return (
                        <i
                            key={i}
                            className={`fa-star star ${starValue <= rating ? 'fas filled' : 'far empty'}`} // Combine classNames
                            onClick={() => onRating(starValue === rating ? 0 : starValue)} // Reset to 0 if the clicked star is already selected
                        ></i>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="contact-page">
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                <h1>Contact Us</h1>

                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={{ display: 'none' }}>
                    <input 
                        type="text" 
                        name="honeypot" 
                        value={formData.honeypot} 
                        onChange={handleChange} 
                    />
                </div>

                {/* Add hidden input to pass the rating */}
                <input 
                    type="hidden" 
                    name="rating" 
                    value={formData.rating} 
                />

                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? <div className="loader"></div>: 'Send Message'}
                </button>
            </form>

            {popup.visible && (
                <div className="popupContact">
                    <p>{popup.message}</p>
                </div>
            )}

            {/* Rating Section */}
            <div className='rate'>
                <StarRating
                    rating={formData.rating} // Use rating from formData
                    onRating={(rate) => setFormData({ ...formData, rating: rate })} // Update rating in formData
                />
            </div>

            {/* Contact Information Section */}
            <div className="contact-info">
                <div className="contact-item">
                    <a href="tel:+21620986015" className="contact-link">
                        <FaPhone className="contact-icon" />
                    </a>
                </div>
                <div className="contact-item">
                    <a href="mailto:contact.ashebrand@gmail.com" className="contact-link">
                        <FaEnvelope className="contact-icon" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;

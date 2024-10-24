import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import lone from '../Images/lone.png';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import './ProductPopup.css';

// Custom Select Styles
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    width: '100%',
    height: 'fit-content',
    margin: '5px 0',
    padding: '10px',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.8vh',
    color: '#f7f7f7',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    outline: 'none',
    transition: 'border-color 0.3s ease, background 0.3s ease',
    boxShadow: 'none',
    '&:focus': {
      borderColor: '#0abab5',
      background: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover': {
      borderColor: '#0abab5',
      background: 'rgba(255, 255, 255, 0.2)',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.8vh',
    color: state.isSelected ? '#ffffff' : '#000000',
    backgroundColor: state.isSelected ? '#0abab5' : 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: '#0abab5',
      color: 'white',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000000',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.8vh',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'rgba(77, 77, 77, 0.514)',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1.8vh',
    textAlign: 'left',
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    backgroundColor: 'rgba(255, 255, 255)',
    borderRadius: '4px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: '200px',
    overflowY: 'auto',
  }),
};

const ProductPopup = React.forwardRef(({
  isOpen,
  setPopupOpen,
}, ref) => {
  const popupRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    address: '',
    size: '',
    product: process.env.REACT_APP_PRODUCT,
    subtotal: process.env.REACT_APP_SUBTOTAL,
    shipping: process.env.REACT_APP_SHIPPING,
    total: process.env.REACT_APP_TOTAL,
    invoiceDate: new Date().toLocaleDateString(), // Formats the date as MM/DD/YYYY
    productImg: '-'
  });

  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      console.log('Fetching countries...');
      try {
        const response = await fetch('https://api.countrystatecity.in/v1/countries', {
          headers: {
'X-CSCAPI-KEY': process.env.REACT_APP_API_KEY,          },
        });
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched countries:', data); // Log the fetched data
        setCountryData(data);
      } catch (error) {
        console.error('Error fetching countries:', error); // Log the error
        setError('Failed to load countries: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when the selected country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!formData.country) return; // Skip fetching if no country is selected
      
      setLoading(true);
      setError(''); // Reset error message before fetch
      try {
        const response = await fetch(`https://api.countrystatecity.in/v1/countries/${formData.country}/states`, {
          headers: {
'X-CSCAPI-KEY': process.env.REACT_APP_API_KEY, // Replace with your actual API key
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch states');
        }
        
        const data = await response.json();
        setStateData(data);
        setFormData(prev => ({ ...prev, state: '', city: '' })); // Reset state and city on country change
      } catch (error) {
        setError(error.message || 'Failed to load states');
      } finally {
        setLoading(false);
      }
    };

    fetchStates();
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCountryInputChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      country: selectedOption.value, // Set country to selected country's ISO2 value
      state: '', // Clear the state field
      city: '',  // Clear the city field
    }));
  };

  const handleStateInputChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      state: selectedOption.label, // Set state to selected state's name
      city: '',  // Clear the city field
    }));
  };


  const validateEmail = (email) => {
    const re = /^[^\s@]+@(gmail|yahoo|icloud|outlook|hotmail)\.[^\s@]+$/i;
    return re.test(email);
  };

  const checkIfFormSubmitted = async (oldOrderCount, formData) => {
    let formSubmitted = false;

    try {
      await addDoc(collection(db, 'orders'), formData);
      const updatedSnapshot = await getDocs(collection(db, 'orders'));
      const newOrderCount = updatedSnapshot.size;
      formSubmitted = newOrderCount > oldOrderCount;
    } catch (error) {
      setError('Failed to submit your preorder! Please try again later.');
      formSubmitted = false;
    }

    return formSubmitted;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      // Validate email format
      if (!validateEmail(formData.email)) {
        setError('Invalid email format.');
        setLoading(false);
        return;
      }
  
      // Check if the email already exists in the 'orders' collection
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const emailExists = querySnapshot.docs.some(doc => doc.data().email === formData.email);
  
      if (emailExists) {
        setError('You have already made an order.');
        setTimeout(() => {
          window.location.reload();
          setPopupOpen(false);
        }, 2000);
        setLoading(false);
        return;
      }
  
      // Check if the form is submitted successfully (custom logic)
      const oldOrderCount = querySnapshot.size;
      const isFormSubmitted = await checkIfFormSubmitted(oldOrderCount, formData);
  
      if (isFormSubmitted) {
            console.log('Email sent successfully!');
            setShowConfirmation(true);
            event.target.reset(); // Reset the form
            setTimeout(() => {
              window.location.reload();
              setPopupOpen(false);
            }, 2000);

      } else {
        setError('Failed to submit the order.');
      }

    } finally {
      setLoading(false);
    }
  };
  
  
  const handleClickOutside = useCallback((event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupOpen(false);
    }
  }, [setPopupOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    isOpen && (
      <>
        <div className={`overlay ${isOpen ? 'active' : ''}`} />
        <div className="popup" role="dialog" ref={popupRef}>
          <div className="popup-inner">
            {/* Close Button */}
            <button className="close-btn" onClick={() => setPopupOpen(false)}>&times;</button>

            {error ? (
              <div className="error-popup">
                <img src={lone} alt="Ashe Logo" className="lone" />
                <p>{error}</p>
              </div>
            ) : showConfirmation ? (
              <div className="confirmation-message">
                <img src={lone} alt="Ashe Logo" className="lone" />
                <p className="thank-you">Thank you for your order.</p>
                <p className="message-body">
                  An email has been sent to you. We appreciate your trust in Ashe.
                </p>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit}>
                <img src={lone} alt="Lone Logo" className="lone" />

                <div className="grid-container">

                  {/* Customer Info Section */}
                  <div className="customer-info">
                    <div className="titler"><h2>Customer Informations</h2></div>
                    <div className="grid-item">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid-item">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid-item">
                      <label htmlFor="phone">Phone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Phone"
                        maxLength="8"
                        pattern="[0-9]{8}"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid-item">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid-item-full">
                      <label htmlFor="size">Size</label>
                      <Select
                        id="size"
                        name="size"
                        placeholder="Size"
                        options={[
                          { value: 'S', label: 'S' },
                          { value: 'M', label: 'M' },
                          { value: 'L', label: 'L' },
                          { value: 'XL', label: 'XL' },
                        ]}
                        value={formData.size ? { value: formData.size, label: formData.size } : null}
                        onChange={(selectedOption) => handleChange({ target: { name: 'size', value: selectedOption.value } })}
                        styles={customSelectStyles}
                        required
                      />
                    </div>
                  </div>

                  {/* Billing Address Section */}
                  <div className="billing-address">
                    <div className="titler"><h2>Billing Address</h2></div>
                    <div className="grid-item-full">
                      <label htmlFor="country">Country</label>
                      <Select
                        id="country"
                        name="country"
                        placeholder="Select Country"
                        options={countryData.map(country => ({ value: country.iso2, label: country.name }))}
                        onChange={handleCountryInputChange}
                        styles={customSelectStyles}
                        required
                      />
                    </div>
                    <div className="grid-item-full">
                      <label htmlFor="state">State</label>
                      <Select
                        id="state"
                        name="state"
                        options={stateData.map(state => ({ value: state.iso2, label: state.name }))}
                        placeholder="Select State"
                        onChange={handleStateInputChange}
                        styles={customSelectStyles}
                        required
                      />
                    </div>
                    <div className="grid-item">
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
      </div>
                    <div className="grid-item">
                      <label htmlFor="zipCode">Zip Code</label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        type="text"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="grid-item-full">
                      <label htmlFor="address">Address</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                </div>

                <div className="grid-item">
                  <button className="submitBtn" type="submit" disabled={loading}>
                    {loading ? <div className="loader"></div> : 'Confirm'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </>
    )
  );
});

export default ProductPopup;

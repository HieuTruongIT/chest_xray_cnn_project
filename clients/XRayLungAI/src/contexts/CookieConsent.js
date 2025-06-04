import React, { useState, useEffect } from 'react';
import '../styles/CookieConsent.css';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookieConsent');
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-modal">
      <div className="cookie-box">
        <h3>AI Pneumonia Cookie</h3>
        <p>
          We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies.
          You can manage your preferences or learn more about our cookie policy.
        </p>
        <div className="cookie-actions">
          <button className="cookie-btn" onClick={handleAccept}>Accept all</button>
          <button className="cookie-btn reject" onClick={handleReject}>Reject all</button>
        </div>
        <div className="cookie-links">
          <a href="#">Privacy Policy</a>
          <span>·</span>
          <a href="#">Terms and Conditions</a>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

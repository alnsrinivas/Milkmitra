import React from 'react';


const AuthPageLayout = ({ children, imageUrl, imageTitle, imageText }) => (
  <div className="auth-page">
    {" "}
    <div className="signup-container">
      <div className="signup-form-section">{children}</div>
      <div
        className="signup-image-section"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="signup-image-content">
          <h2>{imageTitle}</h2>
          <p>{imageText}</p>
        </div>
      </div>
    </div>{" "}
  </div>
);

export default AuthPageLayout;
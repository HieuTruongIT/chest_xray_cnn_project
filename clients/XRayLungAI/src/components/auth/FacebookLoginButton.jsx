// FacebookLoginButton.js
import React from 'react';

const FacebookLoginButton = () => {
  const handleLogin = () => {
    console.log("Facebook Login Clicked");
    // Logic đăng nhập Facebook sẽ được thêm vào đây
  };

  return <button onClick={handleLogin}>Đăng nhập bằng Facebook</button>;
};

export default FacebookLoginButton;

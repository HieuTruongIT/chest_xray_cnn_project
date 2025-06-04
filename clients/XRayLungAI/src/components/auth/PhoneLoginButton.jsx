// PhoneLoginButton.js
import React from 'react';

const PhoneLoginButton = () => {
  const handleLogin = () => {
    console.log("Phone Login Clicked");
    // Logic đăng nhập qua điện thoại sẽ được thêm vào đây
  };

  return <button onClick={handleLogin}>Đăng nhập qua Số điện thoại</button>;
};

export default PhoneLoginButton;

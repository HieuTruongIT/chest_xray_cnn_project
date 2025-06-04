import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Khi ấn vào nút, sẽ chuyển hướng đến trang 'home' (hoặc trang bạn muốn)
    navigate('/home'); // Bạn có thể thay đổi '/home' thành bất kỳ route nào bạn muốn
  };

  return <button onClick={handleLogin}>Đăng nhập bằng Google</button>;
};

export default GoogleLoginButton;

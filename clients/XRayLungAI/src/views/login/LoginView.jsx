import React, { useState } from 'react';
import '../../styles/LoginView.css';
import googleIcon from '../../assets/logo_google.png';
import facebookIcon from '../../assets/logo_facebook.png';
import phoneIcon from '../../assets/logo_phone.png';
import logopneumonia from '../../assets/logo_penumonia.png';
import addAccountIcon from '../../assets/logo_add_accounts.png';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import useAuthController from '../../controllers/auth/useAuthController';

const methods = [
  {
    label: 'Google',
    subtext: 'Đăng nhập bằng Google',
    icon: googleIcon,
    handler: authService.signInWithGoogle,
  },
  {
    label: 'Facebook',
    subtext: 'Đăng nhập bằng Facebook',
    icon: facebookIcon,
    handler: authService.signInWithFacebook,
  },
  {
    label: 'Số điện thoại',
    subtext: 'Đăng nhập bằng số điện thoại',
    icon: phoneIcon,
    handler: null, 
  },
];

const LoginView = () => {
  useAuthController();

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

const handleLogin = async (method) => {
  try {
    const user = await method();
    console.log('Đăng nhập thành công:', user);
    navigate('/home');
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user') {
      setError('Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.');
    } else {
      setError('Đăng nhập thất bại! Vui lòng thử lại.');
    }
    console.error('Lỗi đăng nhập:', err);
  }
};


const formatPhoneNumber = (input) => {
  let phone = input.trim();
  if (phone.startsWith('0')) {
    phone = '+84' + phone.slice(1);
  }
  else if (phone.startsWith('+')) {
    phone = phone;
  } else {
    phone = '';
  }
  return phone;
};

const sendOtp = async () => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  if (!formattedPhone) {
    setError('Số điện thoại không hợp lệ. Vui lòng nhập đúng số điện thoại.');
    return;
  }
  try {
    await authService.getVerificationCode(formattedPhone);
    setStep(2);
    setError(null);
  } catch (err) {
    console.error('Lỗi gửi OTP:', err);
    setError(`Không gửi được mã OTP: ${err.message || err}`);
  }
};


  const confirmOtp = async () => {
    try {
      await authService.confirmCode(otp);
      navigate('/home');
    } catch (err) {
      setError('Mã OTP không hợp lệ. Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <img src={logopneumonia} alt="Logo" className="logo" />
          <h1>Chọn phương thức </h1>
          <p>
            để tiếp tục tới <span className="brand">AI Pneumoria</span>
          </p>
        </div>

        <div className="account-section">
          <div className="account-row">
            {methods.map((method, idx) => (
              <div
                key={idx}
                className="account-card"
                onClick={() =>
                  method.handler
                    ? handleLogin(method.handler)
                    : setShowPhoneModal(true)
                }
              >
                <img src={method.icon} alt={method.label} className="method-icon" />
                <div className="info">
                  <div className="name">{method.label}</div>
                  <div className="email">{method.subtext}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="account-item other">
            <img src={addAccountIcon} alt="Thêm tài khoản" className="method-icon" />
            Sử dụng một tài khoản khác
          </div>

          <div className="footer-note">
            Trước khi sử dụng AI Pneumoria, bạn có thể xem{' '}
            <a href="#">chính sách quyền riêng tư</a> và{' '}
            <a href="#">điều khoản dịch vụ</a> của ứng dụng này.
          </div>

          <div className="footer-help">
            <a href="#">Ngôn ngữ</a>
            <a href="#">Trợ giúp</a>
            <a href="#">Bảo mật</a>
            <a href="#">Liên hệ</a>
          </div>
        </div>
      </div>

      {showPhoneModal && (
        <div className="modal">
          <div className="modal-content green-theme">
            <h2>Đăng nhập với số điện thoại</h2>
            {step === 1 ? ( <>
            <input
              type="tel"
              placeholder="Nhập số điện thoại (vd: 0355668147)"
              value={phoneNumber}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[0-9]*$/.test(val)) {  
                  setPhoneNumber(val);
                  setError(null);
                }
              }}
            />
                <button onClick={sendOtp}>Gửi mã OTP</button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={confirmOtp}>Xác minh OTP</button>
              </>
            )}
            {error && <p className="error-message">{error}</p>}
            <button className="close-btn" onClick={() => setShowPhoneModal(false)}>✕</button>
          </div>
          <div id="recaptcha-container"></div>
        </div>
      )}
    </div>
  );
};

export default LoginView;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUniversity, FaBuilding, FaMapMarkerAlt, FaProjectDiagram, FaUser, FaChalkboardTeacher, FaEnvelopeOpenText,FaSun,FaMoon,FaGithub, FaTwitter, FaLinkedinIn,FaFacebookF } from 'react-icons/fa';
import intrologopneumonia from '../../assets/intro_logo_pneumonia.png';
import logofooter from '../../assets/logo_penumonia.png';
import logoschool from '../../assets/logo_uth.png';
import logofreeback from '../../assets/logo_freeback.png';
import CookieConsent from '../../contexts/CookieConsent';
import '../../styles/IntroView.css';

const IntroView = () => {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <div className="intro-container">
      {/* Header */}
      <header className="intro-header">
        <div className="intro-logo">
          <img src={intrologopneumonia} alt="Logo AI Viêm Phổi" />
        </div>

        <nav className="intro-nav">
          <ul>
            <li><Link to="/home">Trang chủ</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/faq">Blog</Link></li>
            <li><Link to="/how-it-works">Cách hoạt động</Link></li>
            <li><Link to="/more">Khác</Link></li>
          </ul>
        </nav>

        <div className="intro-actions">
          <button onClick={() => navigate('/login')} className="icon-button" title="Đăng nhập">
            <FaUser size={20} />
          </button>

          <button onClick={toggleDarkMode} className="icon-button" title="Chuyển chế độ sáng/tối">
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="intro-main">
        <h1>Chào mừng đến với <span className="highlight">Pneumonia AI</span></h1>
        <p>
          Hệ thống thông minh của chúng tôi sử dụng AI tiên tiến để hỗ trợ phát hiện viêm phổi qua ảnh X-quang ngực.
          Đăng nhập để bắt đầu chẩn đoán và nhận báo cáo chi tiết.
        </p>
        <Link to="/login" className="get-started-btn">Get Started</Link>
      </main>

      {/* Footer */}
      <footer className="intro-footer">
        <div className="footer-columns">
          {/* Cột 1 */}
          <div className="footer-col">
            <img src={logoschool} alt="Logo Trường" className="footer-logo" />
            <p><FaUniversity style={{ color: '#cc2738', marginRight: '6px' }} />Trường ĐH Giao thông Vận tải TP. HCM</p>
            <p><FaBuilding style={{ color: '#cc2738', marginRight: '6px' }} />Khoa/Viện: Công nghệ thông tin</p>
            <p><FaMapMarkerAlt style={{ color: '#cc2738', marginRight: '6px' }} />70 Tô Ký, Quận 12, TP. HCM</p>
          </div>

          {/* Cột 2 */}
          <div className="footer-col center-col">
            <img src={logofooter} alt="Logo Dự án" className="footer-logo" />
            <p><FaProjectDiagram style={{ color: '#cc2738', marginRight: '6px' }} />Dự án: Hệ thống AI phát hiện viêm phổi</p>
            <p><FaUser style={{ color: '#cc2738', marginRight: '6px' }} />Tác giả: Trương Trọng Hiếu</p>
            <p><FaChalkboardTeacher style={{ color: '#cc2738', marginRight: '6px' }} />Lớp: CN22G - Khóa 2022</p>
          </div>

          {/* Cột 3 */}
          <div className="footer-col right-col">
            <img src={logofreeback} alt="Logo Góp ý" className="footer-logo" />
            <p>
              <FaEnvelopeOpenText style={{ color: '#cc2738', marginRight: '6px' }} />
              Gửi góp ý cho chúng tôi:
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" title="GitHub">
                <FaGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" title="Twitter">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-left">© 2025 Pneumonia AI. All rights reserved.</p>
          <div className="footer-right">
            <a href="#">Privacy Policy</a>
            <span>|</span>
            <a href="#">Terms of Service</a>
            <span>|</span>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default IntroView;

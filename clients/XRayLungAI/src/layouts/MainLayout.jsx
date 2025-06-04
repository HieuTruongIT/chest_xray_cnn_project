import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit, faBars, faTimes, faHome, faHistory, faRobot, faFileAlt, faBell,
  faImage, faChartBar, faCog, faSignOutAlt, faUser, faGlobe, faAdjust,
  faLifeRing, faUpload, faMicroscope, faDrawPolygon, faHeartbeat,
  faStethoscope, faFileMedical,faSave
} from '@fortawesome/free-solid-svg-icons';
import logopneumonia from '../assets/logo_penumonia.png';
import useMainLayoutLogic from '../controllers/layouts/MainLayoutController';

const MainLayout = () => {
  const {
    user,
    showSidebar,
    toggleSidebar,
    showUserMenu,
    toggleUserMenu,
    showProfilePopup,
    setShowProfilePopup,
    darkMode,
    toggleTheme,
    isEditingProfile,
    setIsEditingProfile,
    profileData,
    profileMessage,
    profileMessageType,
    setProfileMessage,
    setProfileMessageType,
    handleLogout,
    handleProfileChange,
    handleUpdateProfile,
  } = useMainLayoutLogic();

  return (
    <div className="layout-wrapper">
      <div className={`sidebar ${showSidebar ? 'visible' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-title">
            <img src={logopneumonia} alt="logo pneumonia ai" />
          </span>
          <button className="close-btn" onClick={toggleSidebar}>
            {showSidebar ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
          </button>
        </div>
        <ul>
          <li><Link to="/home"><FontAwesomeIcon icon={faHome} /> Home</Link></li>
          <li><Link to="/home/chatbot"><FontAwesomeIcon icon={faRobot} /> Chatbot</Link></li>
          <li><Link to="/resources"><FontAwesomeIcon icon={faFileAlt} /> Resources</Link></li>
          <li><Link to="/history"><FontAwesomeIcon icon={faHistory} /> History</Link></li>
          <li><Link to="/notifications"><FontAwesomeIcon icon={faBell} /> Notifications</Link></li>
          <li><Link to="/home/my-reports"><FontAwesomeIcon icon={faChartBar} /> My Reports</Link></li>
          <li><Link to="/gallery"><FontAwesomeIcon icon={faImage} /> Gallery</Link></li>
        </ul>
        <div className="sidebar-footer">
          <Link to="/account-settings"><FontAwesomeIcon icon={faCog} /> Settings</Link>
          <button onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /> Logout</button>
        </div>
      </div>

      <div className={`main-content ${showSidebar ? 'shifted' : ''}`}>
        <div className="header">
          <button className="menu-icon" onClick={toggleSidebar}>
            {showSidebar ? '' : <FontAwesomeIcon icon={faBars} />}
          </button>
          <nav className="nav-tabs">
            <Link to="/home/upload"><FontAwesomeIcon icon={faUpload} className="mr-1" /> Upload</Link>
            <Link to="/home/detection"><FontAwesomeIcon icon={faMicroscope} className="mr-1" /> Detection</Link>
            <Link to="/home/segmentation"><FontAwesomeIcon icon={faDrawPolygon} className="mr-1" /> Segmentation</Link>
            <Link to="/home/severity"><FontAwesomeIcon icon={faHeartbeat} className="mr-1" /> Severity</Link>
            <Link to="/home/treatment"><FontAwesomeIcon icon={faStethoscope} className="mr-1" /> Treatment</Link>
            <Link to="/home/report"><FontAwesomeIcon icon={faFileMedical} className="mr-1" /> Report</Link>
          </nav>

          <div className="user-menu-wrapper">
            <button onClick={toggleUserMenu} className="avatar-button">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User Avatar" className="avatar-img" />
              ) : (
                <FontAwesomeIcon icon={faUser} />
              )}
            </button>
            {showUserMenu && (
              <div className="user-menu">
                <button onClick={() => setShowProfilePopup(true)}><FontAwesomeIcon icon={faUser} /> View Profile</button>
                <button><FontAwesomeIcon icon={faCog} /> Account Settings</button>
                <button><FontAwesomeIcon icon={faGlobe} /> Language</button>
                <button onClick={toggleTheme}><FontAwesomeIcon icon={faAdjust} /> Theme</button>
                <button><FontAwesomeIcon icon={faLifeRing} /> Help</button>
                <button onClick={handleLogout} className="logout-button">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>

      {showProfilePopup && (
        <div className="profile-overlay" onClick={() => setShowProfilePopup(false)}>
          <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2><FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: '#c02121' }} /> Hồ sơ cá nhân</h2>
              <button
                className="edit-btn"
                onClick={() => {
                  if (isEditingProfile) {
                    handleUpdateProfile();
                  } else {
                    setIsEditingProfile(true);
                  }
                }}
              >
                <FontAwesomeIcon icon={isEditingProfile ? faSave : faEdit} /> {isEditingProfile ? 'Lưu' : 'Cập nhật'}
              </button>
            </div>
            {profileMessage && (
              <div className={`profile-message ${profileMessageType}`}>
                {profileMessage}
              </div>
            )}
            <div className="popup-body">
              <div className="left-column">
                <img src={user.photoURL} alt="Avatar" className="profile-avatar" />
                <h3>{profileData.name}</h3>
                <p>{user.email}</p>
                <p>{user.phoneNumber}</p>
              </div>

              <div className="right-column">
                {[
                  ['Tuổi', 'age'],
                  ['Giới tính', 'gender'],
                  ['Ngày sinh', 'birthdate'],
                  ['Địa chỉ', 'address'],
                  ['Nhóm máu', 'bloodType'],
                  ['Chiều cao', 'height'],
                  ['Cân nặng', 'weight'],
                  ['Tiền sử bệnh', 'medicalHistory'],
                ].map(([label, key]) => (
                  <div className="profile-row" key={key}>
                    <span>{label}:</span>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        name={key}
                        value={profileData[key]}
                        onChange={handleProfileChange}
                        className="profile-input"
                      />
                    ) : (
                      <p>{profileData[key] || '-'}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const useMainLayoutLogic = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileMessage, setProfileMessage] = useState('');
  const [profileMessageType, setProfileMessageType] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.displayName || '',
    age: '',
    gender: '',
    birthdate: '',
    address: '',
    bloodType: '',
    height: '',
    weight: '',
    medicalHistory: '',
  });

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  const toggleTheme = () => {
    setDarkMode((prev) => {
      document.body.classList.toggle('dark-mode', !prev);
      return !prev;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

const handleUpdateProfile = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/users/put/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-UID': user.uid,
      },
      body: JSON.stringify({
        ...profileData,
        age: parseInt(profileData.age),
        height: parseFloat(profileData.height),
        weight: parseFloat(profileData.weight),
        medicalHistory: profileData.medicalHistory
          .split(',')
          .map((item) => item.trim()),
        photoURL: user.photoURL || '',
      }),
    });

    if (!response.ok) throw new Error('Cập nhật hồ sơ thất bại');

    await response.json();

    setProfileMessage('Cập nhật hồ sơ thành công');
    setProfileMessageType('success');
    setIsEditingProfile(false);

    setTimeout(() => {
      setProfileMessage('');
      setProfileMessageType('');
    }, 3000);

  } catch (error) {
    console.error(error);
    setProfileMessage('Có lỗi xảy ra khi cập nhật hồ sơ');
    setProfileMessageType('error');

    setTimeout(() => {
      setProfileMessage('');
      setProfileMessageType('');
    }, 3000);
  }
};



  useEffect(() => {
    if (!user || !showProfilePopup) return;

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/v1/users/get/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-User-UID': user.uid,
          },
        });

        if (!response.ok) throw new Error('Không thể tải hồ sơ người dùng');

        const data = await response.json();
        setProfileData({
          name: data.name || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          birthdate: data.birthdate || '',
          address: data.address || '',
          bloodType: data.bloodType || '',
          height: data.height?.toString() || '',
          weight: data.weight?.toString() || '',
          medicalHistory: Array.isArray(data.medicalHistory)
            ? data.medicalHistory.join(', ')
            : '',
        });
      } catch (err) {
        console.error(err);
        alert('Không thể tải hồ sơ người dùng');
      }
    };

    fetchProfile();
  }, [showProfilePopup, user]);

  return {
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
    setProfileData,
    handleLogout,
    handleProfileChange,
    handleUpdateProfile,
  };
};

export default useMainLayoutLogic;

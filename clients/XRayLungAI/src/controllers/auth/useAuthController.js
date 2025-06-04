import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import axios from 'axios';

const SERVER_ENDPOINT = 'http://localhost:8081/api/v1/auth/db/user';
const SEND_MAIL_ENDPOINT = 'http://localhost:8083/api/v1/auth/notify-login'; 

const useAuthController = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const userInfo = {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || '',
            phoneNumber: user.phoneNumber || '',
            provider: user.providerData[0]?.providerId || 'unknown',
            photoURL: user.photoURL || '',
          };

          const res = await axios.post(SERVER_ENDPOINT, userInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            console.log('Đã gửi thông tin đăng nhập lên server:', userInfo);

            if (userInfo.email) {
              try {
                const mailRes = await axios.post(
                  SEND_MAIL_ENDPOINT,
                  {
                    email: userInfo.email,
                    displayName: userInfo.name,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                if (mailRes.status === 200) {
                  console.log('Email thông báo đăng nhập đã được gửi.');
                } else {
                  console.error('Lỗi khi gửi email thông báo:', mailRes);
                }
              } catch (mailErr) {
                console.error('Lỗi khi gọi API gửi email:', mailErr);
              }
            }
          } else {
            console.error('Lỗi khi gửi thông tin đăng nhập:', res);
          }
        } catch (err) {
          console.error('Lỗi khi gửi thông tin đăng nhập:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useAuthController;

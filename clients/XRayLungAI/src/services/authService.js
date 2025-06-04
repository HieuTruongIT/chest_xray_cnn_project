import { initializeApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let recaptchaVerifier = null;
let confirmationResult = null;

const setupRecaptcha = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA resolved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
    });
    recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
      console.log('reCAPTCHA rendered with widgetId:', widgetId);
    });
  }
};

const authService = {
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  },

  signInWithFacebook: () => {
    const provider = new FacebookAuthProvider();
    return signInWithRedirect(auth, provider);
  },

  getFacebookRedirectResult: async () => {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  },

  getVerificationCode: async (phoneNumber) => {
    setupRecaptcha();
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return true;
  },

  confirmCode: async (code) => {
    if (!confirmationResult) throw new Error('OTP chưa được gửi.');
    const result = await confirmationResult.confirm(code);
    return result.user;
  },
};

export { authService, auth };

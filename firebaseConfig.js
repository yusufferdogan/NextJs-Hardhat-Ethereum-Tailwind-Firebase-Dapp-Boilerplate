import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA_DA1y6WRXUJ1m34qk4TZz_NvN9hD6HUo',
  authDomain: 'nextjs-ethreum-boilerplate.firebaseapp.com',
  projectId: 'nextjs-ethreum-boilerplate',
  storageBucket: 'nextjs-ethreum-boilerplate.appspot.com',
  messagingSenderId: '713514536596',
  appId: '1:713514536596:web:4048810428c2b2e328ae81',
  measurementId: 'G-ZQ0RGZ8LBQ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);

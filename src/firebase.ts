// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Thay thế các giá trị giả bằng cấu hình thật từ Firebase Console của bạn
// Truy cập trang-9618d trên Firebase -> Project Settings -> General -> Web App
const firebaseConfig = {
  apiKey: "AIzaSy_YOUR_API_KEY_HERE",
  authDomain: "trang-9618d.firebaseapp.com",
  projectId: "trang-9618d",
  storageBucket: "trang-9618d.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo và xuất Firestore database
export const db = getFirestore(app);

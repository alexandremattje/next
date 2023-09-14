import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import { stringify } from "querystring";

// const firebaseConfig = {
//   apiKey: process.env.FB_API_KEY,
//   authDomain: process.env.FB_AUTH_DOMAIN,
//   projectId: process.env.FB_PROJECT_ID,
//   storageBucket: process.env.FB_STORAGE_BUCKET,
//   messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
//   appId: process.env.FB_APP_ID,
//   measurementId: process.env.FB_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyDvdYDb4hCT-GQS8sq8jCqTMd31do1FYZg",
  authDomain: "tarefasnext-52ed9.firebaseapp.com",
  projectId: "tarefasnext-52ed9",
  storageBucket: "tarefasnext-52ed9.appspot.com",
  messagingSenderId: "637958078772",
  appId: "1:637958078772:web:b034ca478357830081a561",
  measurementId: "G-RJTFT8GY8Y"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseapp);

export { db }

import React from 'react';
import { auth, googleProvider } from './firebaseConfig';
import { signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Googlelogin() {

    const navigate=useNavigate()

  const handleGoogleLogin = async () => {
    try {
      // 1. Authenticate with Google on the client side
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      
      // 2. Extract the short-lived ID token
      const idToken = await user.getIdToken();
      
      // 3. Dispatch token to Node.js for backend session verification
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/task/googlelogin`, {name:user.displayName,email:user.email,phoneno:user.phoneNumber,authtype:"google"}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      
       const token = response?.data?.token;
        const role = response?.data?.result?.role;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("email", response?.data?.result?.email);
          localStorage.setItem("theme", response?.data?.result?.theme);
          localStorage.setItem("user", role);
          alert("logined successfully");}

          navigate('/')
     
     
    } catch (error) {
    alert(error)
    }
  };

  return <button
  type='button'
 onClick={()=>handleGoogleLogin()}
  className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition text-black cursor-pointer">
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Continue with Google
</button> 
}

export default Googlelogin 
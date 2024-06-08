//Test user đăng nhập

import { createContext,useEffect,useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
// import Nhaochos from "../img/NhaoNhao.jpg";


export const Authcontext = createContext();

export const AuthcontextProvider=({children})=>
  {
      const [currentUser, setCurrentUser] = useState(() => {
        const storedEncryptedData = Cookies.get("user");
        if (storedEncryptedData) {
            const bytes = CryptoJS.AES.decrypt(storedEncryptedData, 'adminAccessOnly');
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        }
        return null;
    });

      
  
    const login = async (inputs) => {
      const res = await axios.post(
          "http://localhost:8800/api/auth/login",
          inputs,
          {
              withCredentials: true,
          }
      );

      // Mã hóa dữ liệu trước khi lưu vào cookie
      const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(res.data), 'adminAccessOnly').toString();
      Cookies.set("user", encryptedData, { expires: 7 }); // Lưu vào cookie trong 7 ngày

      setCurrentUser(res.data);
  };
  
  useEffect(() => {
    // Chỉ cần gọi hàm login khi currentUser thay đổi, nếu cần có thể kiểm tra currentUser có thay đổi không trước khi gọi hàm
    const saveEncryptedDataToCookie = async () => {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(currentUser), 'adminAccessOnly').toString();
        Cookies.set("user", encryptedData, { expires: 7 }); // Lưu vào cookie trong 7 ngày
    };
    saveEncryptedDataToCookie();
}, [currentUser]);
  
      return(
          <Authcontext.Provider value={{currentUser,login}}>
              {children}
          </Authcontext.Provider>
      );
  };
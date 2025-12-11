import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GoogleAuthContext = createContext(null);

export function GoogleAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // 先設為 true，之後再改回 false
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // 檢查是否有儲存的登入狀態
    const savedUser = localStorage.getItem("googleUser");
    const savedLogin = localStorage.getItem("login");
    
    if (savedUser && savedLogin) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsLoggedIn(true);
    }
  }, []);

  // 獲取用戶資料（先寫死，之後會串接 API）
  const getUserProfile = () => {
    // TODO: 之後串接 API 獲取用戶資料
    // 目前先返回寫死的資料
    if (user?.decoded) {
      return {
        name: "",
        email: "",
        picture: "",
        phone: "0912-345-678",
        department: "資訊工程學系",
        position: "研究生"
      };
    }
    // 如果是 Passkey 登入，返回預設資料
    return {
      name: "蔡政翰",
      email: user?.email || "",
      picture: "images/ntnu_logo.png",
      phone: "0912-345-678",
      department: "資訊工程學系",
      position: "研究生"
    };
  };

  const handleGoogleResponse = (response) => {
    console.log("Google login response:", response);
    
    // 這裡可以發送 credential 到後端驗證
    const decoded = parseJwt(response.credential);
    const userInfo = {
      credential: response.credential,
      decoded: decoded,
      loginType: 'google',
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    };

    // 儲存用戶資訊
    localStorage.setItem("googleUser", JSON.stringify(userInfo));
    localStorage.setItem("login", "true");
    
    setUser(userInfo);
    setIsLoggedIn(true);
    
    toast.success("登入成功！");
  };

  const handlePasskeyResponse = async (credential) => {
    try {
      // TODO: 發送 credential 到後端驗證
      // 目前先模擬成功
      const userInfo = {
        loginType: 'passkey',
        email: credential.response.userHandle ? 
          new TextDecoder().decode(credential.response.userHandle) : "user@example.com",
        credentialId: credential.id
      };

      // 儲存用戶資訊
      localStorage.setItem("googleUser", JSON.stringify(userInfo));
      localStorage.setItem("login", "true");
      
      setUser(userInfo);
      setIsLoggedIn(true);
      
      toast.success("登入成功！");
    } catch (error) {
      console.error("Passkey login error:", error);
      toast.error("登入失敗，請重試");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("googleUser");
    localStorage.removeItem("login");
    localStorage.removeItem("token"); // 清除後端 token
    
    setUser(null);
    setIsLoggedIn(false);
    toast.success("已登出");
    navigate("/", {replace: true});
  };

  // 簡易 JWT 解析（不驗證簽名）
  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Error parsing JWT:", e);
      return null;
    }
  };

  const value = {
    user,
    isLoggedIn,
    handleGoogleResponse,
    handlePasskeyResponse,
    handleLogout,
    getUserProfile
  };

  return (
    <GoogleAuthContext.Provider value={value}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);

  if (!context) {
    throw new Error("useGoogleAuth must be used within GoogleAuthProvider");
  }

  return context;
}


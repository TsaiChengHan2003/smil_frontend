import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

const GoogleAuthContext = createContext(null);

export function GoogleAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // @TODO: 等到登入串好之後、改成 false

  useEffect(() => {
    // 檢查是否有儲存的登入狀態
    const savedUser = localStorage.getItem("googleUser");
    const savedLogin = localStorage.getItem("login");
    
    if (savedUser && savedLogin) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleGoogleResponse = (response) => {
    console.log("Google login response:", response);
    
    // 這裡可以發送 credential 到後端驗證
    const userInfo = {
      credential: response.credential,
      // 解碼 JWT 獲取用戶信息
      decoded: parseJwt(response.credential)
    };

    // 儲存用戶資訊
    localStorage.setItem("googleUser", JSON.stringify(userInfo));
    localStorage.setItem("login", "true");
    
    setUser(userInfo);
    setIsLoggedIn(true);
    
    toast.success("登入成功！");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("login");
    localStorage.removeItem("token"); // 清除後端 token
    
    setUser(null);
    setIsLoggedIn(false);
    
    toast.success("已登出");
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
    handleLogout
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


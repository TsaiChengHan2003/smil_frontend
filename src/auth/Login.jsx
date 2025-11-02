import { useState, useEffect } from "react";
import { GoogleLoginPopup } from "@/components/popup/GoogleLoginPopup";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { isLoggedIn } = useGoogleAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    // 如果已經登入，重定向到首頁
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <GoogleLoginPopup
        show={showLoginPopup}
        onHide={() => setShowLoginPopup(false)}
      />
    </div>
  );
}


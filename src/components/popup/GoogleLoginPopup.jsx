import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";
import { toast } from "react-toastify";

export function GoogleLoginPopup({ show, onHide }) {
  const { t, i18n } = useTranslation();
  const { handleGoogleResponse, handlePasskeyResponse } = useGoogleAuth();
  const googleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentLang = i18n.resolvedLanguage || i18n.language || 'zh';
  const locale = currentLang.startsWith('zh') ? 'zh_TW' : 'en';

  useEffect(() => {
    if (show && window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        callback: (response) => {
          handleGoogleResponse(response);
          onHide();
        },
      });

      // 清理之前的按鈕
      if (googleButtonRef.current.firstChild) {
        googleButtonRef.current.innerHTML = '';
      }

      // 渲染 Google 登入按鈕
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        locale: locale
      });
    }
  }, [show, handleGoogleResponse, locale, onHide]);

  // WebAuthn/Passkey 登入
  const handlePasskeyLogin = async () => {
    if (!window.PublicKeyCredential) {
      toast.error("您的瀏覽器不支援密碼金鑰功能");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: 從後端獲取 challenge
      // 目前先模擬
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        allowCredentials: [], // 從後端獲取已註冊的 credentials
        timeout: 60000,
        userVerification: "preferred"
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      if (credential) {
        await handlePasskeyResponse(credential);
        onHide();
      }
    } catch (error) {
      console.error("Passkey authentication error:", error);
      if (error.name === "NotAllowedError") {
        toast.error("登入已取消");
      } else if (error.name === "InvalidStateError") {
        toast.error("此裝置尚未註冊密碼金鑰");
      } else {
        toast.error("密碼金鑰登入失敗，請重試");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('login')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3 p-4">
          {/* Google 登入 */}
          <div className="d-flex flex-column align-items-center">
            <p className="mb-3 text-muted">使用 Google 帳號登入</p>
            <div ref={googleButtonRef} id="google-signin-button"></div>
          </div>

          {/* 分隔線 */}
          <div className="d-flex align-items-center my-2">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted">或</span>
            <hr className="flex-grow-1" />
          </div>

          {/* 密碼金鑰登入 */}
          <div className="d-flex flex-column align-items-center">
            <p className="mb-3 text-muted">使用密碼金鑰登入</p>
            <button
              className="btn btn-outline-primary d-flex align-items-center gap-2"
              onClick={handlePasskeyLogin}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.16 21.74 12 23C17.84 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 8.6 14.8 10V11.5C15.4 11.5 16 12.1 16 12.7V16.7C16 17.3 15.4 17.9 14.8 17.9H9.2C8.6 17.9 8 17.3 8 16.7V12.7C8 12.1 8.6 11.5 9.2 11.5V10C9.2 8.6 10.6 7 12 7ZM12 8.2C11.2 8.2 10.5 8.7 10.5 9.5V11.5H13.5V9.5C13.5 8.7 12.8 8.2 12 8.2Z" fill="currentColor"/>
              </svg>
              {isLoading ? "登入中..." : "使用密碼金鑰登入"}
            </button>
            <small className="text-muted mt-2">使用您的生物辨識或裝置密碼</small>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}


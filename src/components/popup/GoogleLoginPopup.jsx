import { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useGoogleAuth } from "@/contexts/GoogleAuthContext";

export function GoogleLoginPopup({ show, onHide }) {
  const { t, i18n } = useTranslation();
  const { handleGoogleResponse } = useGoogleAuth();
  const googleButtonRef = useRef(null);

  const currentLang = i18n.resolvedLanguage || i18n.language || 'zh';
  const locale = currentLang.startsWith('zh') ? 'zh_TW' : 'en';

  useEffect(() => {
    if (show && window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        callback: handleGoogleResponse,
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
  }, [show, handleGoogleResponse, locale]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('login')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center align-items-center p-4">
          <div ref={googleButtonRef} id="google-signin-button"></div>
        </div>
      </Modal.Body>
    </Modal>
  );
}


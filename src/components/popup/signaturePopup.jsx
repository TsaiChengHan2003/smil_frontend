import React, { useRef } from "react";
import { CloseButton } from "react-bootstrap";
import SignatureCanvas from "react-signature-canvas";
import styles from "../../assets/scss/page/Signature.module.scss";
import { changeImageDataUrlToFileArray } from "../../utils/blobformatter";

export function SignaturePopup({
  setIsSignaturePopupOpen,
  registerName,
  setValue,
}) {
  const sigCanvas = useRef();

  const save = async () => {
    const dataURL = sigCanvas.current.toDataURL();

    const fileArray = await changeImageDataUrlToFileArray(dataURL);

    setValue(registerName, fileArray);
    setIsSignaturePopupOpen(false);
  };

  const clear = () => {
    sigCanvas.current.clear();
  };

  return (
    <div className={styles.signaturePopup} key={registerName}>
      <div className={styles.signaturePopupContent} style={{ width: "80vw", height: "40vh" }}>
        <h3>電子簽名</h3>
        <CloseButton className={styles.closeButton} onClick={() => setIsSignaturePopupOpen(false)} />
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ style: { border: "1px solid #ccc", width: "100%", height: "75%" } }}
        />
        <div className="d-flex justify-content-center gap-4">
          <button type="button" className="btn btn-secondary" onClick={save}>確認</button>
          <button type="button" className="btn btn-danger" onClick={clear}>清除</button>
        </div>
      </div>
    </div>
  );
}
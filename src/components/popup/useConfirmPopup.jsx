import { useState } from "react";
import { useLoading } from "../../hooks/useLoading";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// 確認彈窗
// 預設值
// defaultConfirmAPIFunc: 確認API函式
// defaultConfirmTitle: 確認標題
// defaultConfirmContent: 確認內容
// defaultNavigateUrl: 確認後跳轉頁面
export const useConfirmPopup = ({ defaultConfirmAPIFunc = () => {}, defaultConfirmTitle = "", defaultConfirmContent = "", defaultNavigateUrl = "", defaultRefreshFunc = () => {} } = {}) => {
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({
    confirmTitle: defaultConfirmTitle,
    confirmContent: defaultConfirmContent,
    confirmAPIFunc: defaultConfirmAPIFunc,
    refreshFunc: defaultRefreshFunc,
    navigateUrl: defaultNavigateUrl,
  });
  const navigate = useNavigate();
  const { setLoading } = useLoading();

  const openConfirmPopup = () => {
    setShow(true);
  };

  const closeConfirmPopup = () => {
    setShow(false);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const response = await modalData.confirmAPIFunc();

      toast.success(response.message);
      modalData.navigateUrl && navigate(modalData.navigateUrl);
      modalData.refreshFunc && modalData.refreshFunc();
      closeConfirmPopup();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 300);
      closeConfirmPopup();
    }
  };

  const ConfirmModal = () => (
    <>
      {show && (
        <Modal show={show} onHide={closeConfirmPopup} centered className={"w-500"}>
          <Modal.Header closeButton>
            <Modal.Title>{modalData.confirmTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="d-flex align-items-center gap-1">
              {modalData.confirmContent}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="light" onClick={closeConfirmPopup}>取消</Button>
            <Button variant="primary" onClick={handleConfirm}>確認</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );

  return {
    openConfirmPopup,
    closeConfirmPopup,
    ConfirmModal,
    setModalData,
  };
};
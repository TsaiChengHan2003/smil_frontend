import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRequest } from "../../hooks/useRequest";
import { SET_IS_CONFIRM_MODAL_CLOSE } from "../../redux/dataTable/separateModalDataTableAction";

export default function OnlyConfirmPopup({ state, dispatch }) {
  const [show, setShow] = useState(true);
  const { defaultRequest } = useRequest();
  const handleClose = () => {
    setShow(false);
    dispatch({ type: SET_IS_CONFIRM_MODAL_CLOSE });
    // state.formMethod.reset();
  };

  const handleDelete = async () => {
    const success = await defaultRequest(() => state.onClickFunction(state.row.id));

    if (success) {
      state.onSearchFunc();
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className={"w-500"}>
      <Modal.Header closeButton>
        <Modal.Title>{"確認"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex align-items-center gap-1">
          確定要<p style={{ color: "red", padding: "0px", margin: "0px" }}>{state.functionType}</p>嗎？
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>取消</Button>
        <Button variant="primary" onClick={handleDelete}>確認</Button>
      </Modal.Footer>
    </Modal>
  );
}
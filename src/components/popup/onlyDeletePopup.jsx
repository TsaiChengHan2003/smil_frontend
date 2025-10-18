import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRequest } from "../../hooks/useRequest";
import { DELETE_ITEM, SET_IS_DELETE_MODAL_CLOSE } from "../../redux/dataTable/separateModalDataTableAction";

export default function OnlyDeletePopup({ state, dispatch, refreshNeeded }) {
  const [show, setShow] = useState(true);
  const { defaultRequest } = useRequest();
  const handleClose = () => {
    setShow(false);
    dispatch({ type: SET_IS_DELETE_MODAL_CLOSE });
  };

  const handleDelete = () => {
    const success = defaultRequest(() => state.onClickFunction(state.row.id));

    if (success) {
      dispatch({ type: DELETE_ITEM, payload: state.row.id });
      refreshNeeded && state.onSearchFunc();
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className={"w-500"}>
      <Modal.Header closeButton>
        <Modal.Title>{`刪除${state.functionName}`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{"請注意🚨！此操作一旦進行則無法復原"}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>取消</Button>
        <Button variant="danger" onClick={handleDelete}>確認</Button>
      </Modal.Footer>
    </Modal>
  );
}
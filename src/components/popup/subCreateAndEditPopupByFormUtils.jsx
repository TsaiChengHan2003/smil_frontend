import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useRequest } from "../../hooks/useRequest";
import {
  ADD_ITEM,
  SET_IS_SUB_MODAL_CLOSE,
  UPDATE_ITEM,
} from "../../redux/dataTable/separateModalDataTableAction";
import { FormBuilder, GridFormBuilder } from "../../utils/formBuilderUtils";
import { formSetter } from "../../utils/formSetter";

export default function SubCreateAndEditPopupByFormUtils({
  state,
  dispatch,
  labelNeeded,
  selectDropdowns,
  divFullWidth,
  labelMinWidth,
  labelMaxHeight,
  gridNumber,
  gridGap,
  gridAlignItems,
  width = 500,
  height = 400,
}) {
  const [show, setShow] = useState(true);
  const { register, setValue, getValues, watch } = state.formMethod;
  const { defaultRequest } = useRequest();
  const handleClose = () => {
    setShow(false);
    dispatch({ type: SET_IS_SUB_MODAL_CLOSE });
  };

  const handleConfirm = async () => {
    const formData = getValues();
    const suscess = await defaultRequest(() => state.onClickFunction(formData));

    if (suscess) {
      if (state.isModalShow === "edit") {
        dispatch({
          type: UPDATE_ITEM,
          payload: { id: state.row.id, updateData: formData },
        });
      } else {
        dispatch({ type: ADD_ITEM, payload: formData });
      }
      handleClose();
    }
  };

  useEffect(() => {
    if (state.row) {
      formSetter(state.row, setValue);
    }
  }, []);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={`w-${width}-h-${height}`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${state.functionType} ${
          state.functionName ? `${state.functionName}` : ""
        }`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {gridNumber ? (
          <GridFormBuilder
            gridNumber={gridNumber}
            gridAlignItems={gridAlignItems}
            gridGap={gridGap}
            inputArray={state.inputArray}
            register={register}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            disabled={state.disabled}
            labelNeeded={labelNeeded}
            labelMinWidth={labelMinWidth}
            labelMaxHeight={labelMaxHeight}
            selectDropdowns={selectDropdowns}
            divFullWidth={divFullWidth}
          />
        ) : (
          <FormBuilder
            inputArray={state.inputArray}
            register={register}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            disabled={state.disabled}
            labelNeeded={labelNeeded}
            labelMinWidth={labelMinWidth}
            labelMaxHeight={labelMaxHeight}
            selectDropdowns={selectDropdowns}
            divFullWidth={divFullWidth}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          確認
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
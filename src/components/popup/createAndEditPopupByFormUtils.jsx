import { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useRequest } from '../../hooks/useRequest'
import { SET_IS_MODAL_CLOSE, UPDATE_ITEM } from '../../redux/dataTable/separateModalDataTableAction'
import { FormBuilder, GridFormBuilder } from '../../utils/formBuilderUtils'
import { formSetter } from '../../utils/formSetter'
import styles from '@styles/components/formFormat.module.scss'
import { validateForm } from '../../utils/validateForm'
import { useLoading } from '../../hooks/useLoading'

export default function CreateAndEditPopupByFormUtils({
  state,
  dispatch,
  labelNeeded,
  selectDropdowns,
  onSearchFunc,
  divFullWidth,
  labelMinWidth,
  labelMaxHeight,
  defaultToday,
  gridNumber,
  gridGap,
  gridAlignItems,
  formPadding = '0px 10px',
  itemMarginBottom = '10px',
  width = 500,
  height = 400,
  jsonParseParamArray = [],
  imageDataUrlArray = [],
}) {
  const [show, setShow] = useState(true)
  const { setLoading } = useLoading()
  const { register, setValue, getValues, watch } = state.formMethod
  const { defaultRequest } = useRequest()
  const handleClose = () => {
    setShow(false)
    dispatch({ type: SET_IS_MODAL_CLOSE })
  }

  const handleConfirm = async () => {
    const formData = getValues()

    if (!validateForm(formData, state.inputArray)) {
      return
    }

    const suscess = await defaultRequest(() => state.onClickFunction(formData))

    if (suscess) {
      state.row &&
        dispatch({ type: UPDATE_ITEM, payload: { id: state.row.id, updateData: formData } })

      if (onSearchFunc && typeof onSearchFunc === 'function') {
        onSearchFunc()
      } else {
        state.onSearchFunc && state.onSearchFunc()
      }
      handleClose()
    }
  }

  useEffect(() => {
    setLoading(true)
    if (state.row) {
      formSetter(state.row, setValue, jsonParseParamArray, imageDataUrlArray)
    }
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className={`w-${width}-h-${height} custom-form`}
    >
      <Modal.Header closeButton>
        <Modal.Title>{`${state.functionType} ${
          state.functionName ? `${state.functionName}` : ''
        }`}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div
          className={styles.formFormat}
          style={{ padding: formPadding, overflowY: 'auto', maxHeight: height }}
        >
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
              defaultToday={defaultToday}
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
              itemMarginBottom={itemMarginBottom}
              defaultToday={defaultToday}
            />
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={handleClose}>
          取消
        </Button>
        {state.isModalShow !== 'review' && (
          <Button variant="primary" onClick={handleConfirm}>
            確認
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

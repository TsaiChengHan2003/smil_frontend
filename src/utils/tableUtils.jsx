// column 是 formInput 的 column
// name 是渲染 table 的 name，例如：dailyReportGetInList.0.buildName
// register 是 useForm 的 register
// watch 是 useForm 的 watch
// disabled 父元件傳入，是否禁用

export function renderTableColumnByType(column, name, register, watch, disabled, selectedDropdown) {
  switch (column.type) {
    case 'select':
      const options = selectedDropdown[column.name] || column.options || []

      return (
        <select
          className="form-select form-select-sm"
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #ced4da',
            backgroundColor: disabled ? '#e9ecef' : '#ffffff',
            minHeight: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.15s ease-in-out',
          }}
          {...register(name)}
          value={watch(name)}
          disabled={disabled}
          placeholder="請選擇"
        >
          <option value="" style={{ color: '#6c757d' }}>
            請選擇
          </option>
          {options?.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case 'select-with-custom':
      const selectOptions = selectedDropdown[column.name] || column.options || []
      const datalistId = `datalist-${name.replace(/[^a-zA-Z0-9]/g, '')}`

      return (
        <div className="position-relative">
          <input
            list={datalistId}
            className="form-control form-control-sm"
            style={{
              fontSize: '12px',
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid #ced4da',
              backgroundColor: disabled ? '#e9ecef' : '#ffffff',
              minHeight: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.15s ease-in-out',
            }}
            placeholder="請選擇或輸入"
            {...register(name)}
            disabled={disabled}
          />
          <datalist id={datalistId}>
            <option value="" />
            {selectOptions?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </datalist>
        </div>
      )
    case 'datetime-local':
      return <input type="text" className="form-control" {...register(name)} disabled={disabled} />
    case 'number':
      return (
        <input
          type="number"
          className="form-control"
          {...register(name)}
          onBlur={e => {
            // 手動觸發一個自定義事件
            const customEvent = new CustomEvent('fieldBlur', {
              detail: {
                name: name,
                value: e.target.value,
              },
              bubbles: true,
            })

            e.target.dispatchEvent(customEvent)
          }}
          disabled={disabled}
        />
      )
    case 'value':
      return <span>{watch(name)}</span>
    case 'text':
      return (
        <div className="d-flex gap-1 align-items-center">
          <input
            type={column.type || 'text'}
            className="form-control"
            placeholder={column.placeholder}
            onBlur={e => {
              // 手動觸發一個自定義事件
              const customEvent = new CustomEvent('fieldBlur', {
                detail: {
                  name: name,
                  value: e.target.value,
                },
                bubbles: true,
              })

              e.target.dispatchEvent(customEvent)
            }}
            disabled={disabled}
            {...register(name)}
          />
          {column.rightDescription && <span>{column.rightDescription}</span>}
        </div>
      )
    case 'textarea':
      return <textarea className="form-control" {...register(name)} disabled={disabled} />
    case 'custom':
      return (
        <div className="d-flex gap-1 align-items-center">
          {column.children.map((child, index) => (
            <div key={index}>{renderTableColumnByType(child, name, register, watch, disabled)}</div>
          ))}
        </div>
      )
    case 'children':
      // 支援自定義 JSX 元素，並傳遞必要的 props
      if (typeof column.element === 'function') {
        // 如果 element 是函數組件，傳遞 props
        return column.element({
          register,
          watch,
          disabled,
        })
      } else {
        // 如果 element 是 JSX 元素，直接渲染
        return column.element
      }
  }
}

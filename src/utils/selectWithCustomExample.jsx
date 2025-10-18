// 使用示例：可自定義輸入的選擇器
// 這個示例展示如何在表格中使用新的 select-with-custom 類型

import React from 'react'
import { useForm } from 'react-hook-form'
import { renderTableColumnByType } from './tableUtils'

// 示例數據
const sampleOptions = [
  { value: 'option1', label: '選項一' },
  { value: 'option2', label: '選項二' },
  { value: 'option3', label: '選項三' },
]

// 表格列配置示例
const tableColumns = [
  {
    name: 'category',
    label: '分類',
    type: 'select-with-custom', // 使用新的類型
    options: sampleOptions,
  },
  {
    name: 'description',
    label: '描述',
    type: 'text',
  },
]

// 使用示例組件
export function SelectWithCustomExample() {
  const { register, watch, handleSubmit } = useForm()

  const onSubmit = data => {
    console.log('表單數據:', data)
  }

  return (
    <div className="container mt-4">
      <h3>可自定義輸入的選擇器示例</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <label className="form-label">分類選擇</label>
            {renderTableColumnByType(
              tableColumns[0],
              'category',
              register,
              watch,
              false, // disabled
              {} // selectedDropdown (空物件，使用 column.options)
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">描述</label>
            {renderTableColumnByType(tableColumns[1], 'description', register, watch, false)}
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          提交
        </button>
      </form>

      <div className="mt-4">
        <h5>功能說明：</h5>
        <ul>
          <li>選擇器會顯示預設的選項列表</li>
          <li>底部會有一個"── 其他 ──"選項</li>
          <li>選擇"其他"後，會出現一個輸入框讓使用者自定義輸入</li>
          <li>使用者也可以直接在輸入框中輸入任何值</li>
          <li>自定義輸入的值會與預設選項區分開來</li>
        </ul>
      </div>
    </div>
  )
}

// 在表格中使用示例
export function TableWithCustomSelect() {
  const { register, watch } = useForm()

  const tableData = [
    { id: 1, category: 'option1', description: '項目一' },
    { id: 2, category: 'custom_value', description: '自定義項目' },
  ]

  return (
    <div className="container mt-4">
      <h3>表格中的可自定義選擇器</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>分類</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>
                {renderTableColumnByType(
                  {
                    name: 'category',
                    type: 'select-with-custom',
                    options: sampleOptions,
                  },
                  `tableData.${index}.category`,
                  register,
                  watch,
                  false,
                  {}
                )}
              </td>
              <td>
                {renderTableColumnByType(
                  {
                    name: 'description',
                    type: 'text',
                  },
                  `tableData.${index}.description`,
                  register,
                  watch,
                  false
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

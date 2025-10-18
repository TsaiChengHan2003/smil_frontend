import { useEffect } from 'react'
import { getCurrentYear, getToday } from './timeUtils'
import SearchableSelect from './searchableSelect'

export function generateSearchBarByInputType({ item, formMethod, selectDropdowns }) {
  const { register, setValue, getValues, watch, control } = formMethod

  switch (item.inputType) {
    case 'labelSelect':
      return <LabelSelectComponent item={item} register={register} />
    case 'text':
      return <TextComponent item={item} register={register} />
    case 'date':
      return <DateComponent item={item} register={register} watch={watch} />
    case 'checkbox':
      return <CheckboxComponent item={item} register={register} setValue={setValue} />
    case 'select':
      return <SelectComponent item={item} register={register} selectDropdowns={selectDropdowns} />
    case 'dynamicInputByLabelValue':
      return (
        <DynamicInputByLabelValueComponent
          item={item}
          formMethod={formMethod}
          selectDropdowns={selectDropdowns}
        />
      )
    case 'searchableSelect':
      return (
        <SearchableSearchBarDropdown
          item={item}
          control={control}
          selectDropdowns={selectDropdowns}
        />
      )
    case 'time':
      return <TimeComponent item={item} register={register} watch={watch} />
    default:
      return null
  }
}

export function OnlyLabelComponent({ item }) {
  return (
    <>
      <span className="input-group-text">{item.labelName || ''}</span>
    </>
  )
}

export function SelectComponent({ item, register, selectDropdowns }) {
  return (
    <>
      <select
        className="form-control"
        id={item.registerName}
        aria-describedby={item.labelId}
        {...register(item.registerName)}
      >
        <option key={item.registerName} value={''}>
          {item.placeholder || '請選擇'}
        </option>
        {(item.options || selectDropdowns[item.registerName] || [])?.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  )
}

export function TextComponent({ item, register }) {
  return (
    <>
      <input
        type={item.inputType}
        className="form-control"
        placeholder={item.placeholder}
        id={item.registerName}
        {...register(item.registerName)}
      />
    </>
  )
}

export function DateComponent({ item, register, watch }) {
  if (item.dateType === 'year') {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => 2000 + i).reverse()

    return (
      <>
        <select
          className="form-control"
          id={item.registerName}
          aria-describedby={item.labelId}
          {...register(item.registerName)}
          defaultValue={getCurrentYear()}
        >
          <option value="">{item.placeholder || '請選擇年份'}</option>
          {years.map(year => (
            <option key={year} value={year}>
              {year + '年'}
            </option>
          ))}
        </select>
      </>
    )
  } else {
    return (
      <>
        <input
          type={item.dateType || 'date'}
          className="form-control"
          placeholder={item.placeholder}
          id={item.registerName}
          aria-describedby={item.labelId}
          defaultValue={watch(item.registerName)}
          {...register(item.registerName)}
        />
      </>
    )
  }
}

export function CheckboxComponent({ item, register, setValue }) {
  return (
    <>
      <input
        type="checkbox"
        className="form-check-input"
        {...register(item.registerName)}
        onChange={e => {
          setValue(item.registerName, e.target.checked ? item.value || '0' : null, {
            shouldValidate: true,
          })
        }}
      />
    </>
  )
}

export function LabelSelectComponent({ item, register }) {
  const labelOptions = Array.isArray(item.labelInfo) ? item.labelInfo : []

  return (
    <>
      <select
        className="input-group-text"
        id={item.registerName}
        {...register(item.labelRegisterName)}
      >
        {labelOptions.map(label => (
          <option key={label.value} value={label.value}>
            {label.label}
          </option>
        ))}
      </select>
      {/* 只傳單一 labelName 給 TextComponent */}
      <TextComponent item={item} register={register} />
    </>
  )
}

export function OnlyLabelSelectComponent({ item, register }) {
  const labelOptions = item.labelInfo || []

  return (
    <>
      <select
        className="input-group-text"
        id={item.registerName}
        aria-describedby={item.labelId}
        {...register(item.labelRegisterName)}
      >
        {labelOptions.map(label => (
          <option key={label.value} value={label.value}>
            {label.label}
          </option>
        ))}
      </select>
    </>
  )
}

export function DynamicInputByLabelValueComponent({ item, formMethod, selectDropdowns }) {
  const { register, watch, setValue } = formMethod
  const labelOptions = Array.isArray(item.labelInfo) ? item.labelInfo : []
  const labelValue = watch(item.labelRegisterName)
  const selectedLabelObj = labelOptions.find(opt => opt.value === labelValue)

  useEffect(() => {
    setValue(item.registerName, '') // 清空右側 input
  }, [labelValue, item.registerName])

  return (
    <div className="d-flex">
      <OnlyLabelSelectComponent item={item} register={register} />
      {selectedLabelObj &&
        generateSearchBarByInputType({
          item: {
            ...item,
            inputType: selectedLabelObj.inputType,
            options: selectedLabelObj.options || undefined,
          },
          formMethod,
          selectDropdowns,
        })}
    </div>
  )
}

export function SearchableSearchBarDropdown({ item, control, selectDropdowns }) {
  return (
    <div className="d-flex align-items-center">
      <SearchableSelect
        registerName={item.registerName}
        options={item.options || selectDropdowns?.[item.registerName] || []}
        control={control}
        placeholder={item.placeholder}
      />
    </div>
  )
}

export function TimeComponent({ item, register, watch }) {
  return (
    <>
      <input
        type="time"
        className="form-control"
        placeholder={item.placeholder}
        id={item.registerName}
        defaultValue={watch(item.registerName)}
        {...register(item.registerName)}
      />
    </>
  )
}

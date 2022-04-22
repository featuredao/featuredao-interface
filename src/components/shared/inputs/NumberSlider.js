import { InputNumber, Slider, Form } from 'antd'
import { useEffect, useState } from 'react'

import {
  percentToPermyriad,
} from 'utils/formatNumber'

// Rounds a value down to a certain number of decimal places if given, else takes floor
export function roundDown(value, decimalPlaces) {
  if (!decimalPlaces) return Math.floor(value)
  return percentToPermyriad(value).toNumber() / 100
}

export default function NumberSlider({
  min,
  max,
  step,
  value,
  suffix,
  onChange,
  disabled,
  name, // Name is required for form validation
  formItemProps,
  style,
}) {
  const [_value, setValue] = useState(value);

  const inputConfig = {
    min: min ?? 0,
    max: max ?? 100,
    step: step ?? 0.1,
  }

  let decimals = 0;
  if (inputConfig.step.toString().indexOf('.') > -1) {
    decimals = inputConfig.step.toString().split('.')[1].length;
  }

  const updateValue = (val) => {
    setValue(val)
    if (onChange) onChange(val)
  }

  useEffect(() => {
    setValue(value)
  }, [value])

  return (
    <div style={style}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <Slider
          {...inputConfig}
          tooltipVisible={false}
          style={{ flex: 1, marginRight: 20 }}
          value={_value}
          onChange={(val) => updateValue(val)}
          disabled={disabled}
        />
        <Form.Item name={name} rules={formItemProps?.rules ?? []}>
          <InputNumber
            {...inputConfig}
            value={_value}
            style={{ width: 120 }}
            disabled={disabled}
            formatter={(val) => {
              let _val = val?.toString() ?? '0'

              if (_val.includes('.') && _val.split('.')[1].length > decimals) {
                _val = roundDown(parseFloat(_val), decimals).toString()
              }

              return `${_val ?? ''}${suffix ?? ''}`
            }}
            parser={(val) =>
              parseFloat(val?.replace(suffix ?? '', '') ?? '0')
            }
            onChange={(val) => {
              const newVal =
                (typeof val === 'string' ? parseFloat(val) : val) ?? undefined
              updateValue(newVal)
            }}
          />
        </Form.Item>
      </div>
      {formItemProps?.extra ? (
        <div className="ant-form-item-extra">{formItemProps.extra}</div>
      ) : null}
    </div>
  )
}

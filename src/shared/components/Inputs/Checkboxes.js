import React from 'react'
import {
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@material-ui/core'

export const LabelledCheckbox = ({
  id,
  checked,
  label,
  onChange,
  CheckboxProps = {},
  ...props
}) => {
  return (
    <FormControlLabel
      key={id}
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          name={id}
          color="primary"
          {...CheckboxProps}
        />
      }
      label={label}
      {...props}
    />
  )
}

export const CheckboxGroup = ({
  checkboxes,
  onChange,
  ...props
}) => {
  return (
    <FormGroup {...props}>
      {checkboxes.map(checkbox => (
        <LabelledCheckbox
          key={checkbox.id}
          onChange={e => onChange(checkbox, e)}
          {...checkbox}
        />
      ))}
    </FormGroup>
  )
}

import React, { useState } from 'react'
import {
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@material-ui/core'

const makeId = function() {
  return (
    '_' +
    Math.random()
      .toString(36)
      .substr(2, 9)
  )
}

const Field = ({ label, widget, ...props }) => {
  const [id] = useState(makeId())
  const options = props.options
  switch (widget) {
    case 'boolean':
      return (
        <FormControlLabel
          control={<Checkbox name={id} {...props} />}
          label={label}
        />
      )
    case 'number':
      return (
        <TextField
          id={id}
          label={label}
          type="number"
          {...props}
        />
      )
    case 'select':
      if (!options) throw new Error('no options for select')
      return (
        <TextField id={id} select label={label} {...props}>
          {options.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      )
    case 'string':
    default:
      return <TextField id={id} label={label} {...props} />
  }
}

export default Field

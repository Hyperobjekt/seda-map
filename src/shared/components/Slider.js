import React, { useState, useRef, useEffect } from 'react'
import {
  withStyles,
  Slider as MuiSlider
} from '@material-ui/core'
import * as _debounce from 'lodash.debounce'

const StyledSlider = withStyles({
  root: {
    height: 2,
    padding: '16px 0'
  },
  thumb: {
    height: 16,
    width: 16,
    marginTop: -8,
    marginLeft: -8
  },
  active: {},
  valueLabel: {
    left: 'calc(-50%)',
    top: 22,
    '& *': {
      background: 'transparent',
      color: '#000'
    }
  },
  track: {
    height: 2
  },
  rail: {
    height: 2,
    opacity: 0.5
  },
  mark: {
    height: 8,
    width: 1,
    marginTop: -3
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  }
})(MuiSlider)

/**
 * A debounced slider component
 */
export default function Slider({
  onChange,
  value: defaultValue,
  ...props
}) {
  const [value, setValue] = useState(defaultValue)
  const event = useRef(null)
  const debouncedChange = useRef(_debounce(onChange, 200))
  useEffect(
    () => value && debouncedChange.current(event.current, value),
    [value]
  )
  useEffect(() => setValue(defaultValue), [defaultValue])
  const handleChange = (e, val) => {
    event.current = e
    setValue(val)
  }
  return (
    <StyledSlider
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}

Slider.defaultProps = {
  onChange: () => {}
}

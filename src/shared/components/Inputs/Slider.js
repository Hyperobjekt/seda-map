import React, { useState, useRef, useEffect } from 'react'
import {
  withStyles,
  Slider as MuiSlider
} from '@material-ui/core'
import * as _debounce from 'lodash.debounce'
import useDidUpdateEffect from '../../hooks/useDidUpdateEffect'
import shallow from 'zustand/shallow'
import usePrevious from '../../hooks/usePrevious'

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
 * Gets the value for the slider, or provides the default value if none is given
 * @param {*} value
 * @param {*} defaultValue
 */
const getValue = (value, defaultValue) => {
  if (typeof value === 'string') value = Number(value)
  return value ? value : defaultValue
}

export default StyledSlider

/**
 * A debounced slider component.
 */
export function DebouncedSlider({
  onChange,
  value: overrideValue,
  defaultValue,
  debounceTime = 200,
  ...props
}) {
  const [value, setValue] = useState(
    getValue(overrideValue, defaultValue)
  )
  // track the previous value
  const prevValue = usePrevious(value)
  // keep a reference to the event to send along with the debounced callback
  const event = useRef(null)
  // keep a reference to the debounced callback
  const debouncedChange = useRef(
    _debounce(onChange, debounceTime)
  )

  // update the debounced callback when callback changes
  useDidUpdateEffect(() => {
    debouncedChange.current = _debounce(onChange, debounceTime)
  }, [onChange])

  // call the debounce callback when the value changes
  useDidUpdateEffect(() => {
    // no callback if value is the same
    if (shallow(prevValue, value)) return
    value && debouncedChange.current(event.current, value)
  }, [value, debouncedChange.current])

  // update the value when a new value is passed
  useDidUpdateEffect(() => {
    const newValue = getValue(overrideValue, defaultValue)
    // do not set value if it hasn't changed
    if (shallow(newValue, value)) return
    setValue(newValue)
  }, [overrideValue, defaultValue])

  // handle changes on the slider
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

DebouncedSlider.defaultProps = {
  onChange: () => {}
}

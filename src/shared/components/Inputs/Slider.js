import React, { useState, useRef } from 'react'
import {
  withStyles,
  Slider as MuiSlider,
  Tooltip
} from '@material-ui/core'
import * as _debounce from 'lodash.debounce'
import useDidUpdateEffect from '../../hooks/useDidUpdateEffect'
import shallow from 'zustand/shallow'
import usePrevious from '../../hooks/usePrevious'

const StyledSlider = withStyles(theme => ({
  root: {
    height: 2,
    padding: '10px 0',
    position: 'relative'
  },
  thumb: {
    height: 12,
    width: 6,
    marginTop: -2,
    marginLeft: -3,
    border: '0.5px solid #757575',
    background: 'white',
    borderRadius: 2,
    '&:focus, &:hover, &$active': {
      height: 14,
      marginTop: -3,
      borderColor: 'currentColor',
      boxShadow: 'inherit'
    },
  },
  active: {},
  track: {
    height: 8,
    background: (props) => props.metric === 'ses' ? 'currentColor' : 'fixed linear-gradient(90deg, #1C4E81 100px, #3A7BBB 139px, #7CB4DC 178px, #C0E1EC 217px, #F5F6F7 256px, #D6EECA 295px, #9FDCA3 334px, #32A877 373px, #1B704D 412px)',
    [theme.breakpoints.down('sm')]: {
      background: (props) => props.metric === 'ses' ? 'currentColor' : 'fixed linear-gradient(90deg, #1C4E81 20px, #3A7BBB 59px, #7CB4DC 98px, #C0E1EC 137px, #F5F6F7 176px, #D6EECA 215px, #9FDCA3 254px, #32A877 293px, #1B704D 332px)',
    }
  },
  rail: {
    height: 8,
    background: '#E0E0E0',
    opacity: 1
  },
  mark: {
    height: 5,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 13
  },
  markLabel: {
    color: '#5D5D5D',
    marginTop: 2,
    [theme.breakpoints.down('sm')]: {
      top: 26
    }
  },
}))(MuiSlider)

const ValueLabelComponent = (props) => {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" arrow title={value}>
      {children}
    </Tooltip>
  );
}

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
      ValueLabelComponent={ValueLabelComponent}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}

DebouncedSlider.defaultProps = {
  onChange: () => {}
}

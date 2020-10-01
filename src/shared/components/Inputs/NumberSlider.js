import React from 'react'
import PropTypes from 'prop-types'
import { Grid, Input, makeStyles } from '@material-ui/core'
import { DebouncedSlider as Slider } from './Slider'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: theme.spacing(6)
  },
  numberInput: {
    width: 64,
    padding: '4px 0px'
  }
}))

/**
 * A slider component with an inline number field
 */
const NumberSlider = ({
  SliderProps,
  inputProps,
  className,
  ...props
}) => {
  const classes = useStyles()
  return (
    <Grid
      container
      className={clsx(classes.wrapper, className)}
      spacing={2}
      justify="flex-start">
      <Grid item xs={9}>
        <Slider
          valueLabelDisplay="off"
          aria-labelledby={'limit-slider'}
          {...props}
          {...SliderProps}
        />
      </Grid>
      <Grid item xs={3}>
        <Input
          className={classes.numberInput}
          inputProps={{
            type: 'number',
            ...props,
            ...inputProps
          }}
        />
      </Grid>
    </Grid>
  )
}

NumberSlider.propTypes = {
  /** props to pass to the slider component */
  SliderProps: PropTypes.object,
  /** props to pass to the number input field */
  inputProps: PropTypes.object,
  /** classname for the root element */
  className: PropTypes.string
}

export default NumberSlider

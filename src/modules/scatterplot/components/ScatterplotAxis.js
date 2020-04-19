import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles, Typography } from '@material-ui/core'
import FlexStack from '../../../shared/components/FlexStack'
import BookEnds from '../../../shared/components/BookEnds'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import clsx from 'clsx'
const useStyles = makeStyles(theme => ({
  root: {}
}))

const ScatterplotAxis = ({
  minLabel,
  maxLabel,
  showLabels = true,
  label,
  className,
  ...props
}) => {
  return (
    <BookEnds
      className={clsx('scatterplot-axis', className)}
      startLabel={
        showLabels &&
        minLabel.length > 1 && (
          <FlexStack>
            <ArrowLeft /> {minLabel}
          </FlexStack>
        )
      }
      endLabel={
        showLabels &&
        maxLabel.length > 1 && (
          <FlexStack>
            {maxLabel} <ArrowRight />
          </FlexStack>
        )
      }
      {...props}>
      <Typography
        variant="body2"
        style={{ textTransform: 'capitalize' }}>
        {label}
      </Typography>
    </BookEnds>
  )
}

ScatterplotAxis.propTypes = {}

export default ScatterplotAxis

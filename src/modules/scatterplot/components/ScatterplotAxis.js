import React from 'react'
import { Typography } from '@material-ui/core'
import { Stack, BookEnds } from '../../../shared'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import ArrowRight from '@material-ui/icons/ArrowRight'
import clsx from 'clsx'

const ScatterplotAxis = ({
  minLabel,
  maxLabel,
  showLabels = true,
  label,
  className,
  children,
  ...props
}) => {
  return (
    <BookEnds
      className={clsx('scatterplot-axis', className)}
      startLabel={
        showLabels &&
        minLabel.length > 1 && (
          <Stack horizontal>
            <ArrowLeft /> {minLabel}
          </Stack>
        )
      }
      endLabel={
        showLabels &&
        maxLabel.length > 1 && (
          <Stack horizontal>
            {maxLabel} <ArrowRight />
          </Stack>
        )
      }
      {...props}>
      <Typography
        variant="body2"
        component="div"
        style={{ textTransform: 'capitalize' }}>
        {label} {children}
      </Typography>
    </BookEnds>
  )
}

ScatterplotAxis.propTypes = {}

export default ScatterplotAxis

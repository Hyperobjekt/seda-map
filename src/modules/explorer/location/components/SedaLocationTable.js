import React from 'react'
import PropTypes from 'prop-types'
import {
  getFormatterForVarName,
  isGapDemographic,
  getMetricLabel,
  getDemographicLabel
} from '../../app/selectors'
import {
  TableCell,
  Tooltip,
  IconButton,
  Button,
  makeStyles
} from '@material-ui/core'
import clsx from 'clsx'
import {
  getDescriptionForVarName,
  getLang
} from '../../app/selectors/lang'
import { TableStats } from '../../../../shared'
import { DivergingStatValue } from '../../../../shared'
import { MetricIcon } from '../../../icons'

const useStyles = makeStyles(theme => ({
  root: {},
  headerCell: {
    padding: 0
  },
  headerButton: {
    width: '100%',
    borderRadius: 0
  },
  rowButton: {
    borderRadius: 0,
    width: '100%',
    paddingLeft: theme.spacing(3),
    ...theme.typography.body1,
    textTransform: 'capitalize',
    letterSpacing: 0,
    textAlign: 'left',
    minHeight: theme.spacing(7),
    justifyContent: 'flex-start',
    lineHeight: theme.spacing(2) + 'px'
  },
  textColumn: {
    width: theme.spacing(16),
    padding: 0
  },
  numberCell: {
    width: theme.spacing(12),
    padding: 0,
    '& .metric-value': {
      justifyContent: 'center'
    },
    '&:hover': {
      background: theme.palette.grey[100]
    }
  },
  activeCell: {
    background: theme.app.highlightColor,
    '& button': {
      boxShadow: `inset 0 -3px 0 ${theme.palette.primary.main}`
    },
    '&$activeValue': {
      background: theme.app.highlightColorAlt
    }
  }
}))

const useTooltipStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
    ...theme.typography.body1
  }
}))

const LocationTooltip = ({ row, column, data, ...props }) => {
  const classes = useTooltipStyles()
  const varName = row + '_' + column
  const value = data[varName]
  return (
    <div
      className={classes.root}
      dangerouslySetInnerHTML={{
        __html:
          value === -999
            ? getLang('DATA_UNAVAILABLE')
            : getDescriptionForVarName(varName, value)
      }}
      {...props}
    />
  )
}

const LocationRowHeader = ({ row, activeRow }) => {
  const classes = useStyles()
  return (
    <TableCell
      className={clsx(classes.textColumn, {
        [classes.activeCell]: row === activeRow
      })}
      component="th"
      scope="row">
      <Button className={classes.rowButton} value={row}>
        {getDemographicLabel(row)}
      </Button>
    </TableCell>
  )
}

const LocationColumnHeader = ({ column, activeColumn }) => {
  const classes = useStyles()
  return (
    <TableCell
      className={clsx(classes.headerCell, {
        [classes.activeCell]: column === activeColumn
      })}
      key={column}
      align="center">
      <Tooltip
        title={getMetricLabel(column, 'TOOLTIP_SWITCH')}
        placement="right"
        arrow>
        <IconButton
          className={classes.headerButton}
          value={column}>
          <MetricIcon metricId={column} />
        </IconButton>
      </Tooltip>
    </TableCell>
  )
}

const LocationCell = ({
  row,
  column,
  data,
  activeRow,
  activeColumn
}) => {
  const classes = useStyles()
  const varName = row + '_' + column
  return (
    <TableCell
      key={`cell${row + column}`}
      align="center"
      className={clsx(classes.numberCell, {
        [classes.activeCell]:
          column === activeColumn || row === activeRow,
        [classes.activeValue]:
          column === activeColumn && row === activeRow
      })}>
      <DivergingStatValue
        value={data[varName]}
        formatter={getFormatterForVarName(varName)}
        invertColor={isGapDemographic(row)}
      />
    </TableCell>
  )
}

const SedaLocationTable = ({ ...props }) => {
  return (
    <TableStats
      renderCell={LocationCell}
      renderColumnHeader={LocationColumnHeader}
      renderRowHeader={LocationRowHeader}
      renderTooltip={LocationTooltip}
      {...props}
    />
  )
}

SedaLocationTable.propTypes = {}

export default SedaLocationTable

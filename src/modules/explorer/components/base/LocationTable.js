import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  makeStyles,
  IconButton,
  Tooltip,
  Button
} from '@material-ui/core'
import { MetricIcon } from '../../../icons'
import {
  getDemographicLabel,
  getFormatterForVarName,
  getMetricLabel,
  isGapDemographic
} from '../../selectors'
import clsx from 'clsx'
import {
  getDescriptionForVarName,
  getLang
} from '../../selectors/lang'
import { DivergingStatValue } from '../../../../shared'

const useTooltipStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0.5),
    ...theme.typography.body1
  }
}))

const DataTooltip = ({ varName, value, ...props }) => {
  const classes = useTooltipStyles()
  return (
    <div
      className={classes.root}
      dangerouslySetInnerHTML={{
        __html:
          value === -999
            ? getLang('DATA_UNAVAILABLE')
            : getDescriptionForVarName(varName, value)
      }}
    />
  )
}

const useStyles = makeStyles(theme => ({
  root: {},
  headerCell: {
    padding: 0
  },
  headerTextCell: {
    fontFamily: theme.app.boldFont,
    '&$textColumn': { paddingLeft: theme.spacing(3) }
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
  },
  activeValue: {},
  rowLabel: {}
}))

const TableHeaderButton = ({ metricId, tooltip, ...props }) => {
  const button = (
    <IconButton {...props}>
      <MetricIcon metricId={metricId} />
    </IconButton>
  )
  return tooltip ? (
    <Tooltip title={tooltip} placement="right" arrow>
      {button}
    </Tooltip>
  ) : (
    button
  )
}

/**
 * Displays stats for a location in a table format, with tooltip hints and header actions
 * TODO: refactor to use rows / cols instead of demographics and metrics, so it is more general purpose.  Then move to shared module
 */
const LocationTable = ({
  data,
  label,
  demographics,
  metrics,
  activeMetric,
  activeDemographic,
  labelPrefix,
  onMetricSelect = () => {},
  onDemographicSelect = () => {},
  ...props
}) => {
  const [hoveredData, setHoveredData] = useState(null)
  const hint = hoveredData ? (
    <DataTooltip
      varName={hoveredData[0]}
      value={hoveredData[1]}
    />
  ) : (
    ''
  )
  const aria = `educational opportunity stats for ${
    data['name']
  }`
  const classes = useStyles()
  return (
    <Table
      className={clsx('stats-table', classes.root)}
      aria-label={aria}
      stickyHeader
      {...props}>
      <TableHead>
        <TableRow>
          <TableCell
            className={clsx(
              classes.textColumn,
              classes.headerCell,
              classes.headerTextCell
            )}>
            {label}
          </TableCell>
          {metrics.map(m => (
            <TableCell
              className={clsx(classes.headerCell, {
                [classes.activeCell]: m === activeMetric
              })}
              key={m}
              align="center">
              <TableHeaderButton
                value={m}
                onClick={onMetricSelect}
                className={classes.headerButton}
                metricId={m}
                tooltip={getMetricLabel(m, 'TOOLTIP_SWITCH')}
              />
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {demographics.map(d => (
          <Tooltip key={d} title={hint} placement="right" arrow>
            <TableRow>
              <TableCell
                className={clsx(classes.textColumn, {
                  [classes.activeCell]: d === activeDemographic
                })}
                component="th"
                scope="row">
                <Button
                  className={classes.rowButton}
                  value={d}
                  onClick={onDemographicSelect}>
                  {getDemographicLabel(d, labelPrefix)}
                </Button>
              </TableCell>
              {metrics.map(m => (
                <TableCell
                  key={`cell${m}`}
                  align="center"
                  className={clsx(classes.numberCell, {
                    [classes.activeCell]:
                      m === activeMetric ||
                      d === activeDemographic,
                    [classes.activeValue]:
                      m === activeMetric &&
                      d === activeDemographic
                  })}
                  onMouseEnter={() =>
                    setHoveredData([
                      d + '_' + m,
                      data[d + '_' + m]
                    ])
                  }
                  onMouseLeave={() => setHoveredData(null)}>
                  <DivergingStatValue
                    value={data[d + '_' + m]}
                    formatter={getFormatterForVarName(
                      d + '_' + m
                    )}
                    invertColor={isGapDemographic(d)}
                  />
                </TableCell>
              ))}
            </TableRow>
          </Tooltip>
        ))}
      </TableBody>
    </Table>
  )
}

LocationTable.propTypes = {
  /** data object to pull values from */
  data: PropTypes.object,
  /** label for the first column */
  label: PropTypes.string,
  /** demographics to show in the table */
  demographics: PropTypes.array,
  /** metrics to show in the table */
  metrics: PropTypes.array,
  /** highlighted metric in the table */
  activeMetric: PropTypes.string,
  /** highlighted demographic in the table */
  activeDemographic: PropTypes.string,
  /** label prefix for demographic lang */
  labelPrefix: PropTypes.string,
  /** handler for metric select */
  onMetricSelect: PropTypes.func,
  /** handler for demographic select */
  onDemographicSelect: PropTypes.func
}

export default LocationTable

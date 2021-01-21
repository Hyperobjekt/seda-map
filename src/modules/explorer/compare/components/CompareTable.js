import React from 'react'
import Table from './Table'
import {
  TableSortLabel,
  Typography,
  useMediaQuery,
  useTheme,
  withStyles
} from '@material-ui/core'
import { SedaLocationName } from '../../location'
import { getPrefixLang } from '../../app/selectors/lang'
import { useRegion } from '../../app/hooks'
import SedaStat from '../../stats/SedaStat'
import useCompareStore from '../hooks/useCompareStore'
import shallow from 'zustand/shallow'
import { getMetricIdsForRegion } from '../../app/selectors/metrics'
import useSetCompareLocation from '../hooks/useSetCompareLocation'
import clsx from 'clsx'
import useCompareLocationsData from '../hooks/useCompareLocationsData'
import { isUnavailable } from '../../app/selectors'

const TABLE_METRICS = ['avg', 'grd', 'coh', 'ses', 'frl']

const numberSorter = (a, b, columnId) => {
  const aVal = a.values[columnId]
  const bVal = b.values[columnId]
  if (isUnavailable(aVal)) return -1
  if (isUnavailable(bVal)) return 1
  const result = aVal - bVal
  return result
}

const styles = theme => ({
  root: {
    borderTop: `1px solid`,
    borderTopColor: theme.palette.divider
  }
})

const TableHeaderMetric = withStyles(theme => ({
  root: {
    minWidth: theme.spacing(18),
    textAlign: 'right'
  },
  sorted: {},
  title: {
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
    display: 'block',
    marginTop: 2,
    lineHeight: 1.43
  }
}))(({ column, classes, children }) => {
  return (
    <div
      className={clsx(classes.root, {
        [classes.sorted]: column.isSorted
      })}>
      <Typography className={classes.title}>
        <TableSortLabel
          active={column.isSorted}
          // react-table has a unsorted state which is not treated here
          direction={column.isSortedDesc ? 'desc' : 'asc'}
        />
        {getPrefixLang(column.id, 'LABEL')}
      </Typography>
      <Typography className={classes.subtitle} variant="caption">
        {getPrefixLang(column.id, 'COMPARE_HINT')}
      </Typography>
      {children}
    </div>
  )
})

function renderLocationCell(props) {
  return (
    <SedaLocationName
      locationId={props.row.original.id}
      markerPosition="left"
    />
  )
}

const renderMetricCell = varName => props => {
  return (
    <SedaStat
      value={props.value}
      varName={varName}
      marginOfError={props.row.original[varName + '_e']}
    />
  )
}

const CompareTable = ({ classes, ...props }) => {
  // pull active metric + demographic from the store, with setter
  const [
    metric,
    demographic,
    setMetric,
    selectedLocation
  ] = useCompareStore(
    state => [
      state.metric,
      state.demographic,
      state.setMetric,
      state.selectedLocation
    ],
    shallow
  )
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const locations = useCompareLocationsData()
  // current region in the explorer
  const [region] = useRegion()
  // function to set the current location for comparison
  const setCompareLocation = useSetCompareLocation()

  // column configuration for the table
  const columns = React.useMemo(() => {
    const metrics = getMetricIdsForRegion(region).filter(
      m => TABLE_METRICS.indexOf(m) > -1
    )
    const metricCols = metrics.map(m => ({
      id: m,
      Header: TableHeaderMetric,
      accessor: [demographic, m].join('_'),
      sortType: numberSorter,
      Cell: renderMetricCell([demographic, m].join('_'))
    }))
    return [
      {
        Header: 'Location',
        accessor: 'name',
        Cell: renderLocationCell,
        style: {
          width: '100%',
          minWidth: 260
        }
      },
      ...metricCols
    ]
  }, [demographic, region])

  // memoized table options
  const options = React.useMemo(
    () => ({
      initialState: {
        pageSize: 10,
        sortBy: [{ id: metric, desc: true }]
      }
    }),
    [metric]
  )

  // handler for when table headers are clicked
  const handleSortChange = React.useCallback(
    sortBy => {
      const newMetric = sortBy
      metric !== newMetric && setMetric(newMetric)
    },
    [metric, setMetric]
  )

  const handleRowClick = React.useCallback(
    row => {
      setCompareLocation(row.original.id)
    },
    [setCompareLocation]
  )
  return locations ? (
    <Table
      className={classes.root}
      data={locations}
      columns={columns}
      options={options}
      sortColumn={metric}
      selected={selectedLocation}
      onSort={handleSortChange}
      onRowClick={handleRowClick}
      stickyHeader={isMobile}
    />
  ) : null
}

export default withStyles(styles)(CompareTable)

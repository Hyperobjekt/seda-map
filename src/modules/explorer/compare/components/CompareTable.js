import React from 'react'
import Table from './Table'
import { Typography, withStyles } from '@material-ui/core'
import {
  SedaLocationName,
  useAllLocationsData
} from '../../location'
import { getLang } from '../../app/selectors/lang'
import { useDemographic, useMetric } from '../../app/hooks'
import SedaStat from '../../stats/SedaStat'

const styles = theme => ({
  root: {
    background: theme.palette.background.paper
  },
  toggleContainer: {
    margin: theme.spacing(2, 0, 1, -0.75),
    [theme.breakpoints.up('md')]: {
      margin: theme.spacing(0, 0, 0, -0.75)
    }
  },
  name: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 600,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: 224,
    [theme.breakpoints.up(1440)]: {
      maxWidth: 320
    }
  }
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
  // pull active metric from the store, with setter
  const [metric, setMetric] = useMetric()
  const [demographic] = useDemographic()

  // data for table
  const data = useAllLocationsData()

  console.log('locations data', data)

  // column configuration for the table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Location',
        accessor: 'name',
        disableSortBy: true,
        Cell: renderLocationCell,
        style: {
          width: '25%',
          minWidth: 260
        }
      },
      {
        id: 'avg',
        Header: getLang('LABEL_AVG'),
        accessor: [demographic, 'avg'].join('_'),
        Cell: renderMetricCell([demographic, 'avg'].join('_'))
      },
      {
        id: 'grd',
        Header: getLang('LABEL_GRD'),
        accessor: [demographic, 'grd'].join('_'),
        Cell: renderMetricCell([demographic, 'grd'].join('_'))
      },
      {
        id: 'coh',
        Header: getLang('LABEL_COH'),
        accessor: [demographic, 'coh'].join('_'),
        Cell: renderMetricCell([demographic, 'coh'].join('_'))
      },
      {
        id: 'ses',
        Header: getLang('LABEL_SES'),
        accessor: [demographic, 'ses'].join('_'),
        Cell: renderMetricCell([demographic, 'ses'].join('_'))
      }
    ],
    [classes.name]
  )

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

  const handleRowClick = React.useCallback(row => {
    console.log('clicked row', row)
  }, [])
  return (
    <Table
      className={classes.table}
      data={data}
      columns={columns}
      options={options}
      sortColumn={metric}
      onSort={handleSortChange}
      onRowClick={handleRowClick}
    />
  )
}

export default withStyles(styles)(CompareTable)

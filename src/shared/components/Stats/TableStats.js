import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  makeStyles,
  Tooltip,
  Typography
} from '@material-ui/core'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  labelCell: {
    padding: 0,
    paddingLeft: theme.spacing(3),
    fontFamily: theme.app.boldFont,
    width: theme.spacing(16)
  }
}))

const defaultRenderTooltip = () => null

const defaultRenderColumnHeader = ({ column, ...props }) => {
  return (
    <TableCell {...props}>
      <Typography>{column}</Typography>
    </TableCell>
  )
}

const defaultRenderRowHeader = ({ row, ...props }) => {
  return (
    <TableCell {...props}>
      <Typography>{row}</Typography>
    </TableCell>
  )
}

const defaultRenderCell = ({
  row,
  column,
  data,
  setHoveredData,
  ...props
}) => {
  return (
    <TableCell
      onMouseLeave={() => setHoveredData(null)}
      onMouseEnter={() => setHoveredData({ row, column, data })}
      {...props}>
      <Typography>{data[row + '_' + column]}</Typography>
    </TableCell>
  )
}

/**
 * Generic component to display stats in a table format, with tooltip hints and header actions
 */
const TableStats = ({
  data,
  label,
  rows,
  columns,
  activeColumn,
  activeRow,
  renderTooltip = defaultRenderTooltip,
  renderRowHeader = defaultRenderRowHeader,
  renderColumnHeader = defaultRenderColumnHeader,
  renderCell = defaultRenderCell,
  TooltipProps,
  ...props
}) => {
  const [hoveredData, setHoveredData] = useState(null)
  const HoverHint = renderTooltip
    ? renderTooltip(hoveredData)
    : null
  const classes = useStyles()
  return (
    <Table
      className={clsx('table', 'table--stats', classes.root)}
      stickyHeader
      {...props}>
      <TableHead>
        <TableRow>
          <TableCell
            className={clsx(
              'table__labelCell',
              classes.labelCell
            )}>
            {label}
          </TableCell>
          {columns.map(c =>
            renderColumnHeader({
              column: c,
              data,
              activeColumn,
              className: 'table__columnHeader'
            })
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(r => (
          <Tooltip
            key={r}
            title={HoverHint}
            placement="right"
            arrow
            {...TooltipProps}>
            <TableRow>
              {renderRowHeader({
                row: r,
                data,
                className: 'table__rowHeader'
              })}
              {columns.map(c =>
                renderCell({
                  row: r,
                  column: c,
                  data,
                  activeRow,
                  activeColumn,
                  setHoveredData,
                  className: 'table__cell'
                })
              )}
            </TableRow>
          </Tooltip>
        ))}
      </TableBody>
    </Table>
  )
}

TableStats.propTypes = {
  /** data object to pull values from */
  data: PropTypes.object,
  /** label for the first column */
  label: PropTypes.string,
  /** array of row identifiers */
  rows: PropTypes.arrayOf(PropTypes.string),
  /** array of column identifiers */
  columns: PropTypes.arrayOf(PropTypes.string),
  /** active column identifier */
  activeColumn: PropTypes.string,
  /** active row identifier */
  activeRow: PropTypes.string,
  /** function that renders the tooltip component */
  renderTooltip: PropTypes.func,
  /** function that renders the row header component */
  renderRowHeader: PropTypes.func,
  /** function that renders the column header component */
  renderColumnHeader: PropTypes.func,
  /** function that renders the cell value component */
  renderCell: PropTypes.func,
  /** props passed to the tooltip component */
  TooltipProps: PropTypes.object
}

export default TableStats

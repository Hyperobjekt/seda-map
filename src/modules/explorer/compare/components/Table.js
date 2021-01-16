import React from 'react'
import clsx from 'clsx'
import MaUTable from '@material-ui/core/Table'
import PropTypes from 'prop-types'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableFooter from '@material-ui/core/TableFooter'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TablePaginationActions from './TablePaginationActions'
import TableRow from '@material-ui/core/TableRow'
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable
} from 'react-table'
import { darken, withStyles } from '@material-ui/core'

const styles = theme => ({
  table: {
    '& .MuiTableCell-root': {},
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      background: theme.palette.background.default
    },
    '& .MuiTypography-root': {},
    '& .MuiTableCell-head': {
      position: 'relative',
      fontWeight: 700,
      lineHeight: 1.2,
      overflow: 'hidden',
      verticalAlign: 'bottom',
      '&.tableCell--active': {
        boxShadow: `0 1px 0px ${theme.palette.primary.outline}`,
        background: theme.palette.primary.highlight
      }
    },
    '& .MuiTableSortLabel-icon': {
      fontSize: 12
    },
    '& .MuiTableCell-body.tableCell--active': {
      background: theme.palette.primary.highlight
    },
    '& .MuiTableRow-root.tableRow--selected': {
      background: theme.palette.primary.highlight,
      '& .MuiTableCell-root': {
        borderBottomColor: theme.palette.primary.outline
      },
      '& .MuiTableCell-body.tableCell--active': {
        background: darken(theme.palette.primary.highlight, 0.02)
      }
    },
    '& .MuiTablePagination-spacer': {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'block'
      }
    }
  }
})

const Table = ({
  columns,
  data,
  skipPageReset = false,
  onRowClick,
  options,
  classes,
  className,
  selected,
  ...props
}) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    state: { pageIndex }
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      ...options
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  )

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  return (
    <>
      <TableContainer
        className={clsx(classes.table, className)}
        {...props}>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => {
              return (
                <TableRow
                  key={i}
                  {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, j) => {
                    return (
                      <TableCell
                        key={j}
                        {...column.getHeaderProps({
                          ...column.getSortByToggleProps(),
                          className: clsx(column.className, {
                            'tableCell--active': column.isSorted
                          })
                        })}
                        variant="head">
                        {column.render('Header')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableHead>
          <TableBody>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <TableRow
                  key={i}
                  {...row.getRowProps({
                    className: clsx(row.className, {
                      'tableRow--selected':
                        row.original?.id === selected
                    }),
                    onClick: event =>
                      onRowClick && onRowClick(row, event),
                    style: {
                      cursor: onRowClick ? 'pointer' : undefined
                    }
                  })}>
                  {row.cells.map((cell, j) => {
                    return (
                      <TableCell
                        key={j}
                        {...cell.getCellProps([
                          {
                            className: clsx(
                              cell.column.className,
                              {
                                'tableCell--active':
                                  cell.column.isSorted
                              }
                            ),
                            style: cell.column.style
                          }
                        ])}>
                        {cell.render('Cell')}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
          {data.length > 10 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10]}
                  colSpan={columns.length}
                  count={data.length}
                  rowsPerPage={10}
                  page={pageIndex}
                  onChangePage={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </MaUTable>
      </TableContainer>
    </>
  )
}

Table.defaultProps = {
  options: {}
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool
}

export default withStyles(styles)(Table)

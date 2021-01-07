import React, { useEffect } from "react"
import clsx from "clsx"
import MaUTable from "@material-ui/core/Table"
import PropTypes from "prop-types"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableFooter from "@material-ui/core/TableFooter"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TablePaginationActions from "./TablePaginationActions"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import {
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table"
import { withStyles } from "@material-ui/core"

const styles = (theme) => ({
  table: {
    "& .MuiTableCell-root": {
    },
    "& .MuiTableBody-root .MuiTableRow-root:hover": {
      background: theme.palette.background.default,
    },
    "& .MuiTypography-root": {
    },
    "& .MuiTableCell-head": {
      position: "relative",
      fontWeight: 700,
      lineHeight: 1.2,
      overflow: "hidden",
      "&.tableCell--active": {
        boxShadow: `inset 0 -4px ${theme.palette.secondary.main}`,
        background: theme.palette.background.default,
      },
    },
    "& .MuiTableSortLabel-icon": {
      fontSize: 12,
    },
    "& .MuiTableCell-body.tableCell--active": {
      background: theme.palette.background.default,
    },
    "& .MuiTablePagination-spacer": {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "block",
      },
    },
  },
})

const Table = ({
  columns,
  data,
  skipPageReset = false,
  onSort,
  onRowClick,
  sortColumn,
  options,
  classes,
  className,
  ...props
}) => {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    toggleSortBy,
    state: { pageIndex, sortBy },
  } = useTable(
    {
      columns,
      data,
      autoResetPage: !skipPageReset,
      ...options,
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  )

  // override sort direction from prop
  // useEffect(() => {
  //   if (sortColumn) {
  //     const currentSortColumn = sortBy[0].id
  //     if (currentSortColumn !== sortColumn) {
  //       console.log("toggle sorting", sortColumn, sortBy)
  //       toggleSortBy(sortColumn, )
  //     }
  //   }
  // }, [sortColumn, toggleSortBy, sortBy])

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage)
  }

  return (
    <>
      <TableContainer className={clsx(classes.table, className)} {...props}>
        <MaUTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => {
              return (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column,j) => {
                    return (
                      <TableCell key={j}
                      {...(column.getHeaderProps(column.getSortByToggleProps()))}
                        variant="head"
                      >
                        {column.render("Header")}
                        <TableSortLabel
                          active={column.isSorted}
                          // react-table has a unsorted state which is not treated here
                          direction={column.isSortedDesc ? 'desc' : 'asc'}
                        />
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
                <TableRow key={i}
                  {...row.getRowProps({
                    onClick: (event) => onRowClick && onRowClick(row, event),
                    style: { cursor: onRowClick ? "pointer" : undefined },
                  })}
                >
                  {row.cells.map((cell, j) => {
                    return (
                      <TableCell key={j}
                        {...cell.getCellProps([
                          {
                            className: clsx(cell.column.className, {
                              "tableCell--active": cell.column.isSorted,
                            }),
                            style: cell.column.style,
                          },
                        ])}
                      >
                        {cell.render("Cell")}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
          {data.length > 10 &&
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    10
                  ]}
                  colSpan={columns.length}
                  count={data.length}
                  rowsPerPage={10}
                  page={pageIndex}
                  onChangePage={handleChangePage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          }
        </MaUTable>
      </TableContainer>
    </>
  )
}

Table.defaultProps = {
  options: {},
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  skipPageReset: PropTypes.bool,
}

export default withStyles(styles)(Table)
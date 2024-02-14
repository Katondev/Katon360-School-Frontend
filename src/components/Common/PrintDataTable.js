import React, { forwardRef, Fragment } from "react"
import {
  useTable,
  useGlobalFilter,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table"
import { Table } from "reactstrap"

const PrintDataTable = ({ printColumns, printData }, ref) => {
  const { headerGroups, rows, prepareRow } = useTable(
    {
      columns: printColumns,
      data: printData,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  return (
    <Fragment>
      <div className="row m-auto" ref={ref}>
        <div className="col-12">
          <Table striped>
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={headerGroup.id + index.toString()}>
                  {headerGroup.headers.map((col, colIndex) => (
                    <th key={col.id + colIndex.toString()}>
                      {col.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {rows.map((row, index) => {
                prepareRow(row)
                return (
                  <tr key={row.getRowProps() + index.toString()}>
                    {row.cells.map((cell, cellIndex) => (
                      <td key={cell.id + cellIndex.toString()}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
      </div>
    </Fragment>
  )
}

export default forwardRef(PrintDataTable)

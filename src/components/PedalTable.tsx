import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedUniqueValues,
  getFacetedRowModel,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pedals from '../data/pedals.json'
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table'
import type { Pedal } from '../types'

const columnHelper = createColumnHelper<Pedal>()

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    enableColumnFilter: false,
    size: 200,
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    size: 100,
  }),
  columnHelper.accessor('ad', {
    header: 'A/D',
    size: 90,
  }),
  columnHelper.accessor('power_V', {
    header: 'Volts',
    cell: info => `${info.getValue()}V`,
    filterFn: 'equals',
    size: 80,
  }),
  columnHelper.accessor('power_mA', {
    header: 'Current',
    cell: info => `${info.getValue()}mA`,
    enableColumnFilter: false,
    size: 90,
  }),
  columnHelper.accessor('power_polarity', {
    header: 'Polarity',
    size: 90,
  }),
  columnHelper.accessor('bypass_type', {
    header: 'Bypass',
    size: 110,
  }),
  columnHelper.accessor('presets', {
    header: 'Presets',
    cell: info => info.getValue() ? 'Yes' : 'No',
    filterFn: 'equals',
    size: 80,
  }),
  columnHelper.accessor('midi', {
    header: 'MIDI',
    cell: info => info.getValue() ? 'Yes' : 'No',
    filterFn: 'equals',
    size: 80,
  }),
]

const booleanOptions = [
  { label: '—', value: '' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

const booleanColumns = new Set(['presets', 'midi'])

export default function PedalTable() {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [showDialog, setShowDialog] = useState(false)

  const table = useReactTable({
    data: pedals as Pedal[],
    columns,
    state: { columnFilters, columnVisibility, sorting },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedRowModel: getFacetedRowModel(),
  })

  const getUniqueValues = (columnId: string) => {
    const column = table.getColumn(columnId)
    if (!column) return []
    return Array.from(column.getFacetedUniqueValues().keys()).sort()
  }

  const getFilterValue = (columnId: string) => {
    return (table.getColumn(columnId)?.getFilterValue() as string) ?? ''
  }

  const setFilter = (columnId: string, value: string) => {
    const column = table.getColumn(columnId)
    if (!column) return
    if (value === '') {
      column.setFilterValue(undefined)
    } else if (booleanColumns.has(columnId)) {
      column.setFilterValue(value === 'true')
    } else {
      column.setFilterValue(value)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Gear Catalog</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="icon-btn" onClick={() => setColumnFilters([])}>↺</button>
          <button className="icon-btn" onClick={() => setShowDialog(true)}>⚙️</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            {/* Sort row */}
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      width: header.getSize(),
                    }}
                  >
                    <span>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <span className="sort-indicator">
                      {header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
            {/* Filter row */}
            <tr>
              {table.getVisibleLeafColumns().map(column => (
                <td key={column.id} className="filter-cell" style={{ width: column.getSize() }}>
                  {column.getCanFilter() ? (
                    <select
                      className="filter-select"
                      value={getFilterValue(column.id) === '' ? '' : String(getFilterValue(column.id))}
                      onChange={e => setFilter(column.id, e.target.value)}
                    >
                      {booleanColumns.has(column.id)
                        ? booleanOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))
                        : [
                            <option key="" value="">—</option>,
                            ...getUniqueValues(column.id).map(v => (
                              <option key={String(v)} value={String(v)}>{String(v)}</option>
                            ))
                          ]
                      }
                    </select>
                  ) : null}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} onClick={() => navigate(`/pedal/${row.original.id}`)}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDialog && (
        <div className="dialog-overlay" onClick={() => setShowDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h2>Visible Columns</h2>
            <div className="dialog-columns">
              {table.getAllColumns().map(column => (
                <label key={column.id}>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                </label>
              ))}
            </div>
            <button className="dialog-close" onClick={() => setShowDialog(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  getFacetedUniqueValues,
} from '@tanstack/react-table'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import pedals from '../data/pedals.json'
import type { ColumnFiltersState } from '@tanstack/react-table'
import type { Pedal } from '../types'

const columnHelper = createColumnHelper<Pedal>()

const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('brand', { header: 'Brand' }),
  columnHelper.accessor('type', { header: 'Type' }),
  columnHelper.accessor('digital', {
    header: 'Digital',
    cell: info => info.getValue() ? 'Yes' : 'No',
  }),
  columnHelper.accessor('stereo', {
    header: 'Stereo',
    cell: info => info.getValue() ? 'Yes' : 'No',
  }),
  columnHelper.accessor('power_V', {
    header: 'Volts',
    cell: info => `${info.getValue()}V`,
  }),
  columnHelper.accessor('power_mA', {
    header: 'Current',
    cell: info => `${info.getValue()}mA`,
  }),
  columnHelper.accessor('power_polarity', { header: 'Polarity' }),
  columnHelper.accessor('bypass_type', { header: 'Bypass' }),
  columnHelper.accessor('presets', {
    header: 'Presets',
    cell: info => info.getValue() ? 'Yes' : 'No',
  }),
  columnHelper.accessor('midi', {
    header: 'MIDI',
    cell: info => info.getValue() ? 'Yes' : 'No',
  }),
]

export default function PedalTable() {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: pedals as Pedal[],
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="page">
      <h1>Gear Catalog</h1>
      <div className="table-wrapper">
        <table>
            <thead>
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                    <th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                ))}
                </tr>
            ))}
            </thead>
            <tbody>
            {table.getRowModel().rows.map(row => (
                <tr
                key={row.id}
                onClick={() => navigate(`/pedal/${row.original.id}`)}
                style={{ cursor: 'pointer' }}
                >
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
    </div>
  )
}
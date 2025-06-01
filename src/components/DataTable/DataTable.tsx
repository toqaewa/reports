import React, { useRef } from 'react';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnResizeMode,
  ColumnOrderState,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useTableConfig } from '../../hooks/useTableConfig';
import { MultiSelect } from '../MultiSelect/MultiSelect';
import './DataTable.css'

interface DataTableProps {
  data: Record<string, string>[];
  globalFilter: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, globalFilter }) => {
  const { tableColumns, filterConfigs } = useTableConfig(data, globalFilter);
  const [columnResizeMode] = React.useState<ColumnResizeMode>('onChange');
  const [columnOrder] = React.useState<ColumnOrderState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      columnOrder,
      columnFilters,
      sorting,
      globalFilter,
    },
    onColumnOrderChange: () => {},
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: () => {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  const handleFilterChange = (columnId: string, selectedValues: string[] | null) => {
    if (!selectedValues || selectedValues.length === 0) {
      setColumnFilters(columnFilters.filter(f => f.id !== columnId));
    } else {
      setColumnFilters([
        ...columnFilters.filter(f => f.id !== columnId),
        { id: columnId, value: selectedValues }
      ]);
    }
  };

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows;

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 50,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  });

  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const paddingTop = virtualRows.length > 0 ? virtualRows[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 
    ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0) 
    : 0;

  return (
    <div className="data-table-container">

      <div className="table-filters">
        {filterConfigs.map(filter => (
          <div key={filter.columnId} className="filter-item">
            <MultiSelect
              options={filter.options}
              selected={columnFilters.find(f => f.id === filter.columnId)?.value as string[] || []}
              onChange={(selected) => handleFilterChange(filter.columnId, selected)}
              placeholder={filter.placeholder}
            />
          </div>
        ))}
      </div>

      <div 
        ref={tableContainerRef}
        className='table-container'
      >
        <table>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{ minWidth: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index];
              return (
                <tr key={row.id} className='table-row'>
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
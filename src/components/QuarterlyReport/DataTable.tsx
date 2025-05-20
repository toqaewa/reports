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

interface DataTableProps {
  data: Record<string, string>[];
  globalFilter: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, globalFilter }) => {
  const { tableColumns } = useTableConfig(data, globalFilter);
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
    <div 
      ref={tableContainerRef}
      style={{ 
        height: '600px',
        overflow: 'auto',
        border: '1px solid #ddd',
        borderRadius: '4px',
        position: 'relative'
      }}
    >
      <table style={{ 
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
        position: 'relative'
      }}>
        <thead style={{ 
          background: '#f5f5f5',
          position: 'sticky',
          top: 0,
          zIndex: 1
        }}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ddd',
                    position: 'relative',
                    minWidth: header.getSize(),
                    background: '#f5f5f5'
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: '4px',
                      background: header.column.getIsResizing() ? 'blue' : 'transparent',
                      cursor: 'col-resize',
                    }}
                  />
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
              <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #eee',
                    }}
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
  );
};
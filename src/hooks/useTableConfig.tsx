import { ColumnDef, ColumnOrderState, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';

type TaskData = Record<string, string>;

export const useTableConfig = (data: TaskData[], globalFilter: string) => {
  const tableColumns = useMemo<ColumnDef<TaskData>[]>(() => {
    if (data.length === 0) return [];
    
    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => ({
      accessorKey: key,
      header: ({ column }) => (
        <div>
          <input
            placeholder={key}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={e => column.setFilterValue(e.target.value)}
          />
        </div>
      ),
      cell: (info) => {
        const value = String(info.getValue());
        return highlightMatches(value, globalFilter);
      },
      minSize: 100,
      filterFn: (row, columnId, filterValue) => {
        const value = String(row.getValue(columnId));
        return value.toLowerCase().includes(filterValue.toLowerCase());
      }
    }));
  }, [data, globalFilter]);

  const highlightMatches = (value: string, search: string) => {
    if (!search) return value;
    
    const parts = value.split(new RegExp(`(${search})`, 'gi'));

    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? 
            <mark key={i} style={{ backgroundColor: '#CF7B5A40', color: '#CF7B5A', padding: '0 2px' }}>{part}</mark> : 
            part
        )}
      </span>
    );
  };

  return {
    tableColumns
  };
};
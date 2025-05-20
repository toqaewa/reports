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
          <div>{key}</div>
          <input
            placeholder={`Filter ${key}`}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={e => column.setFilterValue(e.target.value)}
            style={{
              marginTop: '4px',
              padding: '4px',
              width: '-webkit-fill-available',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
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
            <mark key={i} style={{ backgroundColor: '#ffeb3b', padding: '0 2px' }}>{part}</mark> : 
            part
        )}
      </span>
    );
  };

  return {
    tableColumns
  };
};
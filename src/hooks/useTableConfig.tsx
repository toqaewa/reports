import { ColumnDef, ColumnOrderState, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import highlightMatches from '../components/DataTable/HighlightMatches';

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

  return {
    tableColumns
  };
};
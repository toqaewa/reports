import { ColumnDef, ColumnOrderState, ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import highlightMatches from '../components/DataTable/HighlightMatches';
import { MultiSelect } from '../components/MultiSelect/MultiSelect';

type TaskData = Record<string, string>;

const priorityOrder = {
  'Minor': 0,
  'Medium': 1,
  'High': 2,
  'Critical': 3,
  'Blocker': 4,
};

export const useTableConfig = (data: TaskData[], globalFilter: string) => {
  const tableColumns = useMemo<ColumnDef<TaskData>[]>(() => {
    if (data.length === 0) return [];

    const getUniqueValues = (key: string) => {
      const values = new Set<string>();
      data.forEach(item => {
        const value = item[key];
        if (value) {
          if (key === 'Лейблы') {
            value.split(',').forEach(v => values.add(v.trim()));
          } else {
            values.add(value);
          }
        }
      });
      return Array.from(values).sort();
    };

    
    const firstRow = data[0];
    
    return Object.keys(firstRow).map((key) => {
      const columnDef: ColumnDef<TaskData> = {
        accessorKey: key,
        header: ({ column }) => {
          if (key === 'Описание') {
            return <div>{key}</div>;
          }

          return (
            <div>
              <span 
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                style={{ cursor: 'pointer', marginRight: '5px' }}
              >
                {key} {column.getIsSorted() === 'asc' ? '↑' : column.getIsSorted() === 'desc' ? '↓' : ''}
              </span>
              
              {['Исполнитель', 'Менеджер', 'Приоритет', 'Тип', 'Лейблы'].includes(key) && (
                <MultiSelect
                  options={getUniqueValues(key)}
                  selected={column.getFilterValue() as string[] || []}
                  onChange={(selected) => column.setFilterValue(selected.length ? selected : undefined)}
                />
              )}
              
              {['Оценка (в часах)', 'Кол-во спринтов'].includes(key) && (
                <input
                  placeholder={`Фильтр ${key}`}
                  value={(column.getFilterValue() as string) ?? ''}
                  onChange={e => column.setFilterValue(e.target.value)}
                />
              )}
            </div>
          );
        },
        cell: (info) => {
          const value = String(info.getValue());
          return highlightMatches(value, globalFilter);
        },
        minSize: 100,
      };

      if (['Исполнитель', 'Менеджер', 'Тип'].includes(key)) {
        columnDef.sortingFn = 'alphanumeric';
      }

      if (key === 'Приоритет') {
        columnDef.sortingFn = (rowA, rowB) => {
          const a = priorityOrder[rowA.getValue(key) as keyof typeof priorityOrder] || 0;
          const b = priorityOrder[rowB.getValue(key) as keyof typeof priorityOrder] || 0;
          return a - b;
        };
      }

      if (key === 'Лейблы') {
        columnDef.sortingFn = (rowA, rowB) => {
          const a = (rowA.getValue(key) as string)?.split(',').length || 0;
          const b = (rowB.getValue(key) as string)?.split(',').length || 0;
          return a - b;
        };
      }

      if (['Исполнитель', 'Менеджер', 'Приоритет', 'Тип', 'Лейблы'].includes(key)) {
        columnDef.filterFn = (row, columnId, filterValue: string[]) => {
          if (!filterValue || filterValue.length === 0) return true;
          
          const rowValue = row.getValue(columnId) as string;
          
          if (key === 'Лейблы') {
            const labels = rowValue.split(',').map(l => l.trim());
            return filterValue.some(fv => labels.includes(fv));
          }
          
          return filterValue.includes(rowValue);
        };
      }

      return columnDef;
    });
  }, [data, globalFilter]);


  return {
    tableColumns
  };
};
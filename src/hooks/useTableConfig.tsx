import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import highlightMatches from '../components/DataTable/HighlightMatches';

type TaskData = Record<string, string>;

const priorityOrder = {
  'Minor': 0,
  'Medium': 1,
  'High': 2,
  'Critical': 3,
  'Blocker': 4,
};

export const useTableConfig = (data: TaskData[], globalFilter: string) => {

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

  const filterConfigs = useMemo(() => {
    if (data.length === 0) return [];
    
    const firstRow = data[0];
    return Object.keys(firstRow)
      .filter(key => !['Описание', 'Оценка (в часах)', 'Кол-во спринтов'].includes(key))
      .map((key) => ({
        columnId: key,
        placeholder: key,
        options: getUniqueValues(key),
        isMulti: true
      }));
  }, [data]);

  const tableColumns = useMemo<ColumnDef<TaskData>[]>(() => {
    if (data.length === 0) return [];
    
    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => {
      const columnDef: ColumnDef<TaskData> = {
        accessorKey: key,
        header: ({ column }) => (
          <div 
            className="header-clickable" 
            onClick={() => column.toggleSorting()}
          >
            {key}
            <span className="sort-icon">
              {{
                asc: 
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6.41421 14C5.52331 14 5.07714 12.9229 5.70711 12.2929L11.2929 6.70711C11.6834 6.31658 12.3166 6.31658 12.7071 6.70711L18.2929 12.2929C18.9229 12.9229 18.4767 14 17.5858 14H6.41421Z" fill="currentColor"/>
                  </svg>,
                desc:
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6.41421 10C5.52331 10 5.07714 11.0771 5.70711 11.7071L11.2929 17.2929C11.6834 17.6834 12.3166 17.6834 12.7071 17.2929L18.2929 11.7071C18.9229 11.0771 18.4767 10 17.5858 10H6.41421Z" fill="currentColor"/>
                  </svg>,
              }[column.getIsSorted() as string] ?? null}
            </span>
          </div>
        ),
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
    tableColumns,
    filterConfigs
  };
};
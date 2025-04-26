import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useCSVReader } from 'react-papaparse';
import { 
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  ColumnResizeMode,
  ColumnOrderState,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel
} from '@tanstack/react-table';

// Типы для данных
type TaskData = Record<string, string>;
type ChartData = { type: string; count?: number; estimate?: number };

const QuarterlyReport: React.FC = () => {
  const { CSVReader } = useCSVReader();
  const [data, setData] = useState<TaskData[]>([]);
  const [columns] = useState<ColumnDef<TaskData>[]>([]);
  const [columnResizeMode] = useState<ColumnResizeMode>('onChange');
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Обработка загруженных CSV данных
  const handleOnDrop = (results: any) => {
    const rawData: string[][] = results.data;
    const headers = rawData[0];
    
    const formattedData = rawData.slice(1).map((row) => {
      return headers.reduce((obj, header, i) => {
        obj[header] = row[i];
        return obj;
      }, {} as TaskData);
    });
    
    setData(formattedData);
    
    // Автоматически устанавливаем порядок колонок
    setColumnOrder(headers);
  };

  // Динамическое создание колонок на основе данных
  const tableColumns = useMemo<ColumnDef<TaskData>[]>(() => {
    if (data.length === 0) return [];
    
    const firstRow = data[0];
    return Object.keys(firstRow).map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => info.getValue(),
      minSize: 100,
    }));
  }, [data]);

  // Инициализация таблицы
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      columnOrder,
      columnFilters,
      sorting,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });

  // Группировка данных по типам задач
  const taskTypeStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    const typeCounts = data.reduce((acc, task) => {
      const type = task['Issue Type'] || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [data]);
  
  // Статистика по оценкам
  const estimateStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    return data.reduce((acc, task) => {
      const type = task['Issue Type'] || 'Unknown';
      const estimate = parseFloat(task['Story Points'] || '0') || 0;
      
      const existing = acc.find(item => item.type === type);
      if (existing) {
        existing.estimate! += estimate;
      } else {
        acc.push({ type, estimate });
      }
      
      return acc;
    }, [] as ChartData[]);
  }, [data]);

  return (
    <div className="app-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
        Отчёт по квартальным результатам команды
      </h1>
      
      <div style={{ 
        background: '#f9f9f9', 
        padding: '25px', 
        borderRadius: '8px', 
        marginBottom: '40px',
        border: '2px dashed #ccc'
      }}>
        <CSVReader
          onUploadAccepted={handleOnDrop}
          onError={(error: Error) => console.error(error)}
        >
          {({
            getRootProps,
            acceptedFile,
            ProgressBar,
            getRemoveFileProps,
          }: {
            getRootProps: () => any;
            acceptedFile: File | null;
            ProgressBar: React.FC;
            getRemoveFileProps: () => any;
          }) => (
            <div>
              <div {...getRootProps()} style={{
                border: '2px dashed #4CAF50',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '10px'
              }}>
                Click to upload or drag and drop CSV file
              </div>
              {acceptedFile && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span>{acceptedFile.name}</span>
                  <button {...getRemoveFileProps()} style={{
                    background: 'none',
                    border: 'none',
                    color: 'red',
                    cursor: 'pointer'
                  }}>
                    Remove
                  </button>
                </div>
              )}
              <ProgressBar />
            </div>
          )}
        </CSVReader>
      </div>
      
      {data.length > 0 && (
        <div className="report-content">
          {/* Секция графиков */}
          <div className="charts-section" style={{ marginBottom: '50px' }}>
            <div className="chart-container" style={{ marginBottom: '40px' }}>
              <h2 style={{ color: '#444', marginBottom: '20px' }}>
                Распределение задач по типам
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={taskTypeStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    name="Количество задач"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="chart-container">
              <h2 style={{ color: '#444', marginBottom: '20px' }}>
                Распределение story points по типам задач
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={estimateStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="estimate" 
                    fill="#82ca9d" 
                    name="Story Points"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Секция таблицы */}
          <div className="table-section">
            <h2 style={{ color: '#444', marginBottom: '20px' }}>
              Детализация задач ({data.length} записей)
            </h2>
            
            <div style={{ marginBottom: '20px' }}>
              <input
                placeholder="Фильтр по всем колонкам..."
                style={{ padding: '8px', width: '100%' }}
                value={(table.getColumn('Issue Key')?.getFilterValue() as string) ?? ''}
                onChange={(e) => table.setGlobalFilter(e.target.value)}
              />
            </div>
            
            <div style={{ 
              overflowX: 'auto',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <table style={{ 
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0
              }}>
                <thead style={{ background: '#f5f5f5' }}>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            fontWeight: 'bold',
                            borderBottom: '1px solid #ddd',
                            position: 'relative',
                            minWidth: header.getSize(),
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div style={{ marginTop: '5px' }}>
                              <input
                                placeholder={`Filter...`}
                                style={{ width: '100%', padding: '4px' }}
                                value={(header.column.getFilterValue() as string) ?? ''}
                                onChange={(e) => 
                                  header.column.setFilterValue(e.target.value)
                                }
                              />
                            </div>
                          ) : null}
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
                              userSelect: 'none',
                              touchAction: 'none',
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #eee' }}>
                      {row.getVisibleCells().map(cell => (
                        <td
                          key={cell.id}
                          style={{
                            padding: '12px 16px',
                            borderBottom: '1px solid #eee',
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#666'
            }}>
              <div>
                Показано {table.getRowModel().rows.length} из {data.length} записей
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  style={{ padding: '5px 10px' }}
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  style={{ padding: '5px 10px' }}
                >
                  {'<'}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  style={{ padding: '5px 10px' }}
                >
                  {'>'}
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  style={{ padding: '5px 10px' }}
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuarterlyReport;
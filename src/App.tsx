import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { useVirtualizer } from '@tanstack/react-virtual';

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
  const [globalFilter, setGlobalFilter] = useState('');
  const [searchValue, setSearchValue] = useState(''); // для дебаунса

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
    
    setColumnOrder(headers);
  };

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

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      columnOrder,
      columnFilters,
      sorting,
      globalFilter,
    },
    onColumnOrderChange: setColumnOrder,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
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

  // дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(searchValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGlobalFilter(value);
  };

  const handleClearSearch = () => {
    setGlobalFilter('');
    setSearchValue('');
  };

  // подсветка совпадений по поиску
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

  const taskTypeStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    const typeCounts = data.reduce((acc, task) => {
      const type = task['Issue Type']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [data]);
  
  const estimateStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    return data.reduce((acc, task) => {
      const type = task['Issue Type']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      const estimate = Math.round(parseFloat(task['Original estimate'] || '0')/3600) || 0;
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
                Распределение эстимейта по задачам
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
                    name="Estimate"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="table-section">
            <h2 style={{ color: '#444', marginBottom: '20px' }}>
              {data.length} задач
            </h2>
            
            <div 
              style={{ 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  placeholder="Поиск по всем колонкам..."
                  style={{ 
                    padding: '10px',
                    width: '-webkit-fill-available',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                  value={globalFilter}
                  onChange={handleSearchChange}
                />
                {globalFilter && (
                    <button
                      onClick={handleClearSearch}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#999'
                      }}
                    >
                      ×
                    </button>
                )}
              </div>
            </div>
            
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
          </div>
        </div>
      )}
    </div>
  );
};

export default QuarterlyReport;
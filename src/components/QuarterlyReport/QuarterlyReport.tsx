import React from 'react';
import "./QuarterlyReport.css"
import { useTaskData } from '../../hooks/useTaskData';
import { useSearch } from '../../hooks/useSearch';
import { CSVUploader } from '../CSVUploader/CSVUploader';
import { DataTable } from '../DataTable/DataTable';
import { Input } from '../Input/Input';
import { Chart } from '../Charts/Chart';

export const QuarterlyReport: React.FC = () => {
  const { data, taskTypeStats, estimateStats, taskAssigneeStats, taskReporterStats, taskPriorityStats, labelStats, handleOnDrop, clearData } = useTaskData();
  const { globalFilter, handleSearchChange, handleClearSearch } = useSearch();

  return (
    <div>
      <div className='title-section'><h1>Отчет о квартальных результатах команды</h1></div>
      
      <CSVUploader onDrop={handleOnDrop} onClear={clearData} />

      {data.length > 0 && (
        <div>
          <div className="charts-section">
            <Chart data={taskTypeStats} name='Распределение задач по типам' dataKey='count' />
            <Chart data={taskPriorityStats} name='Распределение задач по приоритету' dataKey='count' />
            <Chart data={estimateStats} name='Распределение эстимейта по задачам' dataKey='estimate' />
            <Chart data={taskAssigneeStats} name='Распределение задач по исполнителю' dataKey='count' />
            <Chart data={taskReporterStats} name='Распределение задач по менеджеру' dataKey='count' />
            <Chart data={labelStats} name='Распределение задач по лейблам' dataKey='count' />
            {/* <Chart data={} name='' dataKey='' /> */}
          </div>
          
          <div className="table-section">
            <h2>{data.length} задач</h2>
            
            <Input 
              value={globalFilter}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
              placeholder="Поиск"
            />
            
            <DataTable 
              data={data}
              globalFilter={globalFilter}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuarterlyReport;
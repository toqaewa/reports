import React from 'react';
import "./QuarterlyReport.css"
import { useTaskData } from '../../hooks/useTaskData';
import { useSearch } from '../../hooks/useSearch';
import { CSVUploader } from '../CSVUploader/CSVUploader';
import { TaskTypeChart } from '../Charts/TaskTypeChart';
import { EstimateChart } from '../Charts/EstimateChart';
import { TaskAssigneeChart } from '../Charts/TaskAssigneeChart';
import { DataTable } from '../DataTable/DataTable';
import { Input } from '../Input/Input';
import { TaskReporterChart } from '../Charts/TaskReporterChart';

export const QuarterlyReport: React.FC = () => {
  const { data, taskTypeStats, estimateStats, taskAssigneeStats, taskReporterStats, handleOnDrop } = useTaskData();
  const { globalFilter, handleSearchChange, handleClearSearch } = useSearch();

  return (
    <div>
      <div className='title-section'><h1>Отчет о квартальных результатах команды</h1></div>
      
      <CSVUploader onDrop={handleOnDrop} />

      {data.length > 0 && (
        <div>
          <div className="charts-section">
            <TaskTypeChart data={taskTypeStats} />
            <EstimateChart data={estimateStats} />
            <TaskAssigneeChart data={taskAssigneeStats} />
            <TaskReporterChart data={taskReporterStats} />
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
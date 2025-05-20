import React from 'react';
import { useTaskData } from '../../hooks/useTaskData';
import { useSearch } from '../../hooks/useSearch';
import { CSVUploader } from './CSVUploader';
import { TaskTypeChart } from '../Charts/TaskTypeChart';
import { EstimateChart } from '../Charts/EstimateChart';
import { TaskAssigneeChart } from '../Charts/TaskAssigneeChart';
import { DataTable } from './DataTable';
import { SearchInput } from './SearchInput';

export const QuarterlyReport: React.FC = () => {
  const { data, taskTypeStats, estimateStats, taskAssigneeStats, handleOnDrop } = useTaskData();
  const { globalFilter, handleSearchChange, handleClearSearch } = useSearch();

  return (
    <div className="app-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center', marginBottom: '30px' }}>
        Отчёт по квартальным результатам команды
      </h1>
      
      <CSVUploader onDrop={handleOnDrop} />
      
      {data.length > 0 && (
        <div className="report-content">
          <div className="charts-section" style={{ marginBottom: '50px' }}>
            <TaskTypeChart data={taskTypeStats} />
            <EstimateChart data={estimateStats} />
            <TaskAssigneeChart data={taskAssigneeStats} />
          </div>
          
          <div className="table-section">
            <h2 style={{ color: '#444', marginBottom: '20px' }}>
              {data.length} задач
            </h2>
            
            <SearchInput 
              value={globalFilter}
              onChange={handleSearchChange}
              onClear={handleClearSearch}
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
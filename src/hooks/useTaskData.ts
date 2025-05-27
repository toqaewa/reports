import { useState, useMemo, useEffect } from 'react';

type TaskData = Record<string, string>;
type ChartData = { type: string; count?: number; estimate?: number };

const STORAGE_KEY = 'quarterlyReportData';

const compressData = (data: TaskData[]): TaskData[] => {
  return data.map(task => {
    const compressedTask: TaskData = {};
    if (task['Issue Type']) compressedTask['Issue Type'] = task['Issue Type'];
    if (task['Original estimate']) compressedTask['Original estimate'] = task['Original estimate'];
    if (task['Assignee']) compressedTask['Assignee'] = task['Assignee'];
    if (task['Reporter']) compressedTask['Reporter'] = task['Reporter'];
    // подумать что еще может быть нужно для отчетов
    return compressedTask;
  });
};

export const useTaskData = () => {
  const [data, setData] = useState<TaskData[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setData(parsedData);
        }
      } catch (e) {
        console.error('Failed to parse saved data', e);
      }
    }
  }, []);

  const handleOnDrop = (results: any) => {
    const rawData: string[][] = results.data;
    const headers = rawData[0];
    
    const formattedData = rawData.slice(1).map((row) => {
      return headers.reduce((obj, header, i) => {
        obj[header] = row[i];
        return obj;
      }, {} as TaskData);
    });
    
    const compressedData = compressData(formattedData);
    setData(formattedData);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedData));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      // добавить fallback - сохранение первых N записей
    }
  };

  const clearData = () => {
    setData([]);
    localStorage.removeItem(STORAGE_KEY);
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

  const taskAssigneeStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    const assigneeCounts = data.reduce((acc, task) => {
      const type = task['Assignee']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(assigneeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [data]);

  const taskReporterStats = useMemo((): ChartData[] => {
    if (!data.length) return [];
    
    const reporterCounts = data.reduce((acc, task) => {
      const type = task['Reporter']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(reporterCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [data]);

  return {
    data,
    taskTypeStats,
    estimateStats,
    taskAssigneeStats,
    taskReporterStats,
    handleOnDrop,
    setData,
    clearData,
  };
};
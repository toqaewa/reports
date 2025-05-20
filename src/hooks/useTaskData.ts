import { useState, useMemo } from 'react';

type TaskData = Record<string, string>;
type ChartData = { type: string; count?: number; estimate?: number };

export const useTaskData = () => {
  const [data, setData] = useState<TaskData[]>([]);

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

  return {
    data,
    taskTypeStats,
    estimateStats,
    handleOnDrop,
    setData
  };
};
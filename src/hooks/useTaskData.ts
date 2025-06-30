import { useState, useMemo, useEffect } from 'react';

type TaskData = Record<string, string> & {
  mergedLabels?: string;
  sprintCount?: string;
};

type ChartData = { type: string; count?: number; estimate?: number };

type StatsData = { team: string; count: number; estimate: number };

const STORAGE_KEY = 'quarterlyReportData';

// в экспорте jira каждый лейбл - это отдельное поле, кол-во полей - это самое большое кол-во лейблов в задаче, так что мержу в 1 поле
const mergeTaskLabels = (task: TaskData, headers: string[]): string => {
  const labelIndices = headers
    .map((header, index) => header === 'Labels' ? index : -1)
    .filter(index => index !== -1);

  const allLabels = labelIndices
    .flatMap(index => {
      const value = task[`col_${index}`];
      if (!value || value.trim() === '') return [];
      return value.split(',').map(label => label.trim()).filter(Boolean);
    })
    .filter((label, index, self) => self.indexOf(label) === index);

  return allLabels.join(', ');
};

// в экспорте jira каждый спринт это тоже отдельное поле с названием спринта (Design Sprint 69), сколько спринтов путешествовала таска - столько и полей
const countSprints = (task: TaskData, headers: string[]): string => {
  const sprintIndices = headers
    .map((header, index) => header === 'Sprint' ? index : -1)
    .filter(index => index !== -1);

  let count = 0;
  sprintIndices.forEach(index => {
    const value = task[`col_${index}`];
    if (value && value.trim() !== '') {
      count++;
    }
  });

  return count.toString(); // ВНИМАНИЕ: тут привожу кол-во спринтов к строке
};

const compressData = (data: TaskData[], headers: string[]): TaskData[] => {
  return data.map(task => {
    const compressedTask: TaskData = {
      'Описание': task['Summary'],
      'Исполнитель': task['Assignee'],
      'Менеджер': task['Reporter'],
      'Приоритет': task['Priority'],
      'Оценка (в часах)': task['Original estimate'] && (parseFloat(task['Original estimate'])/3600).toFixed(2).toString(),
      'Тип': task['Issue Type'],
      'Кол-во спринтов': countSprints(task, headers),
      'Лейблы': mergeTaskLabels(task, headers),
      // подумать что еще может быть нужно для отчетов, пока что юзаю просто свой датасет
      
      // данные из отчета Дениса
      'Команда': task['Team Name'],
    };
    return compressedTask;
  });
};

export const useTaskData = (selectedTeam?: string | null) => {
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
      const task: TaskData = {};
      
      headers.forEach((header, index) => {
        if ((header !== 'Labels') && (header !== 'Sprint')) {
          task[header] = row[index];
        } else {
          task[`col_${index}`] = row[index];
        }
      });
      
      task.mergedLabels = mergeTaskLabels(task, headers);
      task.sprintCount = countSprints(task, headers);
      return task;
    });
    
    const compressedData = compressData(formattedData, headers);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedData));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compressedData.slice(0, 500)));
    }

    setData(compressedData);
  };

  const clearData = () => {
    setData([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  // фильтр по команде
  const filteredData = useMemo(() => {
    if (!selectedTeam) return data;
    return data.filter(task => task['Команда'] === selectedTeam);
  }, [data, selectedTeam]);

  const taskTypeStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const typeCounts = filteredData.reduce((acc, task) => {
      const type = task['Тип']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [filteredData]);

  const taskPriorityStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const priorityCounts = filteredData.reduce((acc, task) => {
      const priority = task['Приоритет']?.trim();
      if (!priority || priority === 'Unknown') return acc;
      
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(priorityCounts).map(([priority, count]) => ({
      type: priority,
      count
    }));
  }, [filteredData]);
  
  const estimateStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    return filteredData.reduce((acc, task) => {
      const type = task['Тип']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      const estimate = Math.round(parseFloat(task['Оценка (в часах)'] || '0')) || 0;
      const existing = acc.find(item => item.type === type);

      if (existing) {
        existing.estimate! += estimate;
      } else {
        acc.push({ type, estimate });
      }
      
      return acc;
    }, [] as ChartData[]);
  }, [filteredData]);

  const taskAssigneeStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const assigneeCounts = filteredData.reduce((acc, task) => {
      const type = task['Исполнитель']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(assigneeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [filteredData]);

  const taskReporterStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const reporterCounts = filteredData.reduce((acc, task) => {
      const type = task['Менеджер']?.trim();
      if (!type || type === 'Unknown') return acc;
      
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(reporterCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [filteredData]);

  const labelStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const labelCounts: Record<string, number> = {};
    let noLabelCount = 0;

    filteredData.forEach(task => {
      if (!task["Лейблы"] || task["Лейблы"].trim() === '') {
        noLabelCount++;
        return;
      }
      
      const labels = task["Лейблы"].split(',').map(label => label.trim()).filter(Boolean);

      labels.forEach(label => {
        labelCounts[label] = (labelCounts[label] || 0) + 1;
      });
    });

    const result = Object.entries(labelCounts)
      .map(([label, count]) => ({ type: label, count }))
      .sort((a, b) => b.count - a.count);

    if (noLabelCount > 0) {
      result.push({ type: "Без лейбла", count: noLabelCount });
    }

    return result;
  }, [filteredData]);

  const sprintStats = useMemo((): ChartData[] => {
    if (!filteredData.length) return [];
    
    const sprintDistribution = filteredData.reduce((acc, task) => {
      const count = parseInt(task.sprintCount || '0');
      acc[count] = (acc[count] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return Object.entries(sprintDistribution)
      .map(([sprintNum, count]) => ({
        type: `${sprintNum} спринтов`,
        count
      }))
      .sort((a, b) => parseInt(a.type) - parseInt(b.type));
  }, [filteredData]);

  // для общей статы по командам - потом связать с этой логикой расчет параметров, зависимых от команды
  // ВНИМАНИЕ!! статистика по командам всегда рассчитывается по всем данным
  const teamStats = useMemo((): StatsData[] => {
  if (!data.length) return [];
  
  const teamMap = new Map<string, { count: number; estimate: number }>();
  
  data.forEach(task => {
    const team = task['Команда']?.trim() || 'Без команды';
    const estimate = parseFloat(task['Оценка (в часах)'] || '0') || 0;
    
    const current = teamMap.get(team) || { count: 0, estimate: 0 };
    teamMap.set(team, {
      count: current.count + 1,
      estimate: current.estimate + estimate
    });
  });
  
  return Array.from(teamMap.entries()).map(([team, { count, estimate }]) => ({
    team,
    count,
    estimate: Math.round(estimate)
  }));
}, [data]);

  return {
    filteredData,
    data, // на всякий
    taskTypeStats,
    taskPriorityStats,
    estimateStats,
    taskAssigneeStats,
    taskReporterStats,
    sprintStats,
    labelStats,
    teamStats,
    handleOnDrop,
    setData,
    clearData,
  };
};
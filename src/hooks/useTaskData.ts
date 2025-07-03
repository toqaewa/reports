import { useState, useEffect } from "react";
import { TaskData } from "./types";

import { 
  mergeTaskLabels, 
  countSprints, 
  extractQuarter, 
  compressData 
} from "./taskDataUtils";

const STORAGE_KEY = "quarterlyReportData";

export const useTaskData = () => {
  const [data, setData] = useState<TaskData[]>([]);

  // const ensureQuarterData = (task: TaskData): TaskData => {
  //   if (!task["Квартал"] && task["Parent"]) {
  //     return {
  //       ...task,
  //       quarter: extractQuarter(task["Parent"]),
  //     };
  //   }
  //   return task;
  // };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setData(parsedData);
        }
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  const handleOnDrop = (results: any) => {
    const rawData: string[][] = results.data;
    const headers = rawData[0];

    const formattedData = rawData.slice(1).map((row) => {
      const task: TaskData = {};

      headers.forEach((header, index) => {
        if (header !== "Labels" && header !== "Sprint") {
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
      console.error("Failed to save data to localStorage", e);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(compressedData.slice(0, 500))
      );
    }

    setData(compressedData);
  };

  const clearData = () => {
    setData([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    data,
    handleOnDrop,
    clearData,
    setData
  };
};
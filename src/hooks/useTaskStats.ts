import { useMemo } from "react";
import { TaskData, ChartData, StatsCalculations } from "./types";
import {
  calculateStats,
  calculateLabelStats,
  calculateSprintStats,
} from "./statsCalculations";

export const useTaskStats = (
  data: TaskData[],
  selectedTeam?: string | null
): StatsCalculations & { filteredData: TaskData[] } => {
  const filteredData = useMemo(() => {
    if (!selectedTeam) return data;
    return data.filter((task) => {
      const team = task["Команда"]?.trim() || "Без команды";
      return team === selectedTeam;
    });
  }, [data, selectedTeam]);

  const stats = useMemo(() => {
    const emptyStats: StatsCalculations = {
      taskTypeStats: [],
      taskPriorityStats: [],
      estimateStats: [],
      taskAssigneeStats: [],
      taskReporterStats: [],
      labelStats: [],
      sprintStats: [],
    };

    if (!filteredData.length) return emptyStats;

    return {
      taskTypeStats: calculateStats(filteredData, "Тип", "count"),
      taskPriorityStats: calculateStats(filteredData, "Приоритет", "count"),
      estimateStats: calculateStats(filteredData, "Тип", "estimate"),
      taskAssigneeStats: calculateStats(filteredData, "Исполнитель", "count"),
      taskReporterStats: calculateStats(filteredData, "Менеджер", "count"),
      labelStats: calculateLabelStats(filteredData),
      sprintStats: calculateSprintStats(filteredData),
    };
  }, [filteredData]);

  return {
    ...stats,
    filteredData,
  };
};

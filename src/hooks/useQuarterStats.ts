import { useMemo } from "react";
import {
  TaskData,
  QuarterStats,
  GroupedStats,
  GroupedChartData,
  ChartData,
} from "./types";
import {
  calculateStats,
  calculateLabelStats,
  calculateSprintStats,
} from "./statsCalculations";

export const useQuarterStats = (data: TaskData[]) => {
  const quarterStats = useMemo((): QuarterStats[] => {
    if (!data.length) return [];

    const uniqueQuarters = new Set(data.map((task) => task["Квартал"]));
    const quarters = Array.from(uniqueQuarters);

    const sortedQuarters = quarters.sort((a, b) => {
      const matchA = a.match(/(\d{4}) Q(\d)/i);
      const matchB = b.match(/(\d{4}) Q(\d)/i);

      if (!matchA) return 1;
      if (!matchB) return -1;

      const yearA = parseInt(matchA[1], 10);
      const quarterA = parseInt(matchA[2], 10);
      const yearB = parseInt(matchB[1], 10);
      const quarterB = parseInt(matchB[2], 10);

      return yearA - yearB || quarterA - quarterB;
    });

    return sortedQuarters.map((quarter) => {
      const quarterData = data.filter((task) => task["Квартал"] === quarter);

      return {
        quarter,
        taskTypeStats: calculateStats(quarterData, "Тип", "count"),
        taskPriorityStats: calculateStats(quarterData, "Приоритет", "count"),
        estimateStats: calculateStats(quarterData, "Тип", "estimate"),
        taskAssigneeStats: calculateStats(quarterData, "Исполнитель", "count"),
        taskReporterStats: calculateStats(quarterData, "Менеджер", "count"),
        labelStats: calculateLabelStats(quarterData),
        sprintStats: calculateSprintStats(quarterData),
      };
    });
  }, [data]);

  const groupedStats = useMemo((): GroupedStats => {
    const emptyStats: GroupedStats = {
      taskTypeStats: [],
      taskPriorityStats: [],
      estimateStats: [],
      taskAssigneeStats: [],
      taskReporterStats: [],
      labelStats: [],
      sprintStats: [],
    };

    if (data.length === 0 || quarterStats.length <= 1) {
      return emptyStats;
    }

    const result: GroupedStats = { ...emptyStats };

    quarterStats.forEach((qStat) => {
      if (qStat.quarter === "Не указан") return;

      const addToGroup = (
        source: ChartData[],
        target: GroupedChartData[],
        quarter: string
      ) => {
        source.forEach((item) => {
          target.push({
            ...item,
            quarter,
            type: `${item.type} (${quarter})`,
          });
        });
      };

      addToGroup(qStat.taskTypeStats, result.taskTypeStats, qStat.quarter);
      addToGroup(
        qStat.taskPriorityStats,
        result.taskPriorityStats,
        qStat.quarter
      );
      addToGroup(qStat.estimateStats, result.estimateStats, qStat.quarter);
      addToGroup(
        qStat.taskAssigneeStats,
        result.taskAssigneeStats,
        qStat.quarter
      );
      addToGroup(
        qStat.taskReporterStats,
        result.taskReporterStats,
        qStat.quarter
      );
      addToGroup(qStat.labelStats, result.labelStats, qStat.quarter);
      addToGroup(qStat.sprintStats, result.sprintStats, qStat.quarter);
    });

    return result;
  }, [quarterStats, data]);

  return { quarterStats, groupedStats };
};

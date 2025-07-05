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

    const extractQuarterInfo = (str: string) => {
      const match = str.match(/(\d{4}) Q(\d)|Q(\d)[^\d]*(\d{2})/i);
      if (!match) return { year: 9999, quarter: 9999 };

      return match[1]
        ? {
            year: parseInt(match[1], 10),
            quarter: parseInt(match[2], 10),
          }
        : {
            year: 2000 + parseInt(match[4], 10),
            quarter: parseInt(match[3], 10),
          };
    };

    const sortedQuarters = quarters.sort((a, b) => {
      const infoA = extractQuarterInfo(a);
      const infoB = extractQuarterInfo(b);
      return infoA.year - infoB.year || infoA.quarter - infoB.quarter;
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

    if (data.length === 0) {
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

import { useMemo } from "react";
import { TaskData, StatsData } from "./types";

// для общей статы по командам - потом связать с этой логикой расчет параметров, зависимых от команды
// ВНИМАНИЕ!! статистика по командам всегда рассчитывается по всем данным
export const useTeamStats = (data: TaskData[]) => {
  const teamStats = useMemo((): StatsData[] => {
    if (!data.length) return [];

    const teamMap = new Map<string, { count: number; estimate: number }>();

    data.forEach((task) => {
      const team = task["Команда"]?.trim() || "Без команды";
      const estimate = parseFloat(task["Оценка (в часах)"] || "0") || 0;

      const current = teamMap.get(team) || { count: 0, estimate: 0 };
      teamMap.set(team, {
        count: current.count + 1,
        estimate: current.estimate + estimate,
      });
    });

    return Array.from(teamMap.entries()).map(([team, { count, estimate }]) => ({
      team,
      count,
      estimate: Math.round(estimate),
    }));
  }, [data]);

  return { teamStats };
};

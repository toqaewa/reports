import { TaskData } from "./types";

// в экспорте jira каждый лейбл - это отдельное поле, кол-во полей - это самое большое кол-во лейблов в задаче, так что мержу в 1 поле
export const mergeTaskLabels = (task: TaskData, headers: string[]): string => {
  const labelIndices = headers
    .map((header, index) => (header === "Labels" ? index : -1))
    .filter((index) => index !== -1);

  const allLabels = labelIndices
    .flatMap((index) => {
      const value = task[`col_${index}`];
      if (!value || value.trim() === "") return [];
      return value
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean);
    })
    .filter((label, index, self) => self.indexOf(label) === index);

  return allLabels.join(", ");
};

// в экспорте jira каждый спринт это тоже отдельное поле с названием спринта (Design Sprint 69), сколько спринтов путешествовала таска - столько и полей
export const countSprints = (task: TaskData, headers: string[]): string => {
  const sprintIndices = headers
    .map((header, index) => (header === "Sprint" ? index : -1))
    .filter((index) => index !== -1);

  let count = 0;
  sprintIndices.forEach((index) => {
    const value = task[`col_${index}`];
    if (value && value.trim() !== "") {
      count++;
    }
  });

  return count.toString();
};

// export const extractQuarter = (parent: string) => {
//   if (!parent) return "Не указан";
//   const match = parent.match(/(\d{4}) Q(\d)/i);
//   return match ? `${match[1]} Q${match[2]}` : "Не указан";
// };

export const extractQuarter = (parent: string): string => {
  if (!parent) return "Не указан";

  const match = parent.match(/(\d{4})[\s\-_]*Q(\d)|Q(\d)[\s\-_]*(\d{2,4})/i);

  if (!match) return "Не указан";

  if (match[1]) {
    // 2025 Q2
    return `${match[1]} Q${match[2]}`;
  } else {
    // Q2-25
    const year = match[4].length === 2 ? `20${match[4]}` : match[4];
    return `${year} Q${match[3]}`;
  }
};

export const compressData = (
  data: TaskData[],
  headers: string[]
): TaskData[] => {
  return data.map((task) => {
    const parent = task["Parent summary"];
    const quarter = extractQuarter(parent);
    const originalEstimate = Number(task["Original estimate"]) / 3600;
    const customEstimate = Number(task["Custom field (FE Estimate (h))"]);
    const estimate = originalEstimate || customEstimate;

    // отладка
    console.info(
      `Original estimate: ${originalEstimate}, FE Estimate: ${customEstimate}, Using: ${estimate}`
    );
    
    return {
      Описание: task["Summary"],
      Исполнитель: task["Assignee"],
      Менеджер: task["Reporter"],
      Приоритет: task["Priority"],
      "Оценка (в часах)": estimate?.toFixed(2).toString(),
      Тип: task["Issue Type"],
      "Кол-во спринтов": countSprints(task, headers),
      Лейблы: mergeTaskLabels(task, headers),
      Команда: task["Team Name"],
      Квартал: quarter,
    };
  });
};

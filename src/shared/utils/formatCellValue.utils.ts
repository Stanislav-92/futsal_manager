export const formatCellValue = (key: string, value: number): string => {
  switch (key) {
    case 'winRate':
      return `${value.toFixed(1)}%`;
    case 'avgPoints':
    case 'avgGoalsScored':
    case 'avgGoalsConceded':
      return value.toFixed(2);
    default:
      return `${value}`;
  }
};

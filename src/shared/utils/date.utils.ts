import dayjs from 'dayjs';

export const validateMatchDate = (value: dayjs.Dayjs | null): true | string => {
  if (!value || !value.isValid()) return 'Invalid date';
  if (value.isBefore(dayjs(), 'day')) return 'Date cannot be in the past';
  return true;
};

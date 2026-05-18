import dayjs from 'dayjs';
import i18n from '@/shared/i18n/i18n';

export const validateMatchDate = (value: dayjs.Dayjs | null): true | string => {
  if (!value || !value.isValid()) return i18n.t('validation.invalidDate');
  if (value.isBefore(dayjs(), 'day')) return i18n.t('validation.datePast');
  return true;
};

import i18n from '@/shared/i18n/i18n';

export const validateRequired = (value: string, fieldName: string): true | string =>
  value.trim() !== '' || i18n.t('validation.required', { field: fieldName });

export const validateEmail = (value: string): true | string => {
  if (value.trim() === '') return i18n.t('validation.emailRequired');
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || i18n.t('validation.invalidEmail');
};

export const validatePhone = (value: string): true | string => {
  if (value.trim() === '') return i18n.t('validation.phoneRequired');
  return /^\d{9}$/.test(value) || i18n.t('validation.phoneDigits');
};

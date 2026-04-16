export const validateRequired = (value: string, fieldName: string): true | string =>
  value.trim() !== '' || `${fieldName} is required`;

export const validateEmail = (value: string): true | string => {
  if (value.trim() === '') return 'Email is required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Invalid email';
};

export const validatePhone = (value: string): true | string => {
  if (value.trim() === '') return 'Phone is required';
  return /^\d{9}$/.test(value) || 'Phone must be 9 digits';
};

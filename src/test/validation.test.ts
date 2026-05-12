import { describe, it, expect } from 'vitest';
import { validateEmail, validatePhone, validateRequired } from '@/shared/utils/validation.utils';

describe('validateRequired', () => {
  it('returns error for empty string', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required');
  });

  it('returns error for whitespace only', () => {
    expect(validateRequired('   ', 'Name')).toBe('Name is required');
  });

  it('returns true for valid value', () => {
    expect(validateRequired('John', 'Name')).toBe(true);
  });
});

describe('validateEmail', () => {
  it('returns error for empty string', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error for invalid email', () => {
    expect(validateEmail('notanemail')).toBe('Invalid email');
  });

  it('returns true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
});

describe('validatePhone', () => {
  it('returns error for empty string', () => {
    expect(validatePhone('')).toBe('Phone is required');
  });

  it('returns error for non-digit characters', () => {
    expect(validatePhone('12345678a')).toBe('Phone must be 9 digits');
  });

  it('returns error for wrong length', () => {
    expect(validatePhone('12345678')).toBe('Phone must be 9 digits');
  });

  it('returns true for valid 9-digit phone', () => {
    expect(validatePhone('123456789')).toBe(true);
  });
});

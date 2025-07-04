export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateDate(dateString: string): ValidationResult {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return { isValid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  const today = new Date();
  const minDate = new Date('1995-06-16');
  
  if (date > today) {
    return { isValid: false, error: 'Date cannot be in the future' };
  }

  if (date < minDate) {
    return { isValid: false, error: 'Date cannot be before 1995-06-16' };
  }

  return { isValid: true };
}

export function validateDateRange(
  startDate: string, 
  endDate: string, 
  maxDays: number = 30
): ValidationResult {
  const startValidation = validateDate(startDate);
  if (!startValidation.isValid) {
    return { isValid: false, error: `Start date: ${startValidation.error}` };
  }

  const endValidation = validateDate(endDate);
  if (!endValidation.isValid) {
    return { isValid: false, error: `End date: ${endValidation.error}` };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    return { isValid: false, error: 'Start date must be before end date' };
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > maxDays) {
    return { isValid: false, error: `Date range cannot exceed ${maxDays} days` };
  }

  return { isValid: true };
}

export function validateCount(count: string): ValidationResult {
  const num = parseInt(count, 10);
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Count must be a number' };
  }

  if (num < 1 || num > 10) {
    return { isValid: false, error: 'Count must be between 1 and 10' };
  }

  return { isValid: true };
}

export function validateNeoId(id: string): ValidationResult {
  if (!id) {
    return { isValid: false, error: 'NEO ID is required' };
  }

  if (!id.match(/^\d+$/)) {
    return { isValid: false, error: 'NEO ID must contain only numbers' };
  }

  if (id.length < 7 || id.length > 8) {
    return { isValid: false, error: 'NEO ID must be 7-8 digits long' };
  }

  return { isValid: true };
}

export function sanitizeQuery(query: any): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    } else if (Array.isArray(value) && value.length > 0) {
      sanitized[key] = String(value[0]).trim();
    }
  }
  
  return sanitized;
}

export function getCurrentWeekRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 3);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 3);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

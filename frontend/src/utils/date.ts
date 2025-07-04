export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDateRange = (
  days: number
): { startDate: string; endDate: string } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

export const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const isDateInRange = (
  date: string,
  minDate?: string,
  maxDate?: string
): boolean => {
  const checkDate = new Date(date);

  if (minDate && checkDate < new Date(minDate)) return false;
  if (maxDate && checkDate > new Date(maxDate)) return false;

  return true;
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const formatDisplayDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getDaysDifference = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

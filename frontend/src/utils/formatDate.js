import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export const formatDate = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: zhCN });
  } catch (error) {
    return dateString;
  }
};

export const formatDateShort = (dateString) => {
  try {
    const date = parseISO(dateString);
    return format(date, 'yyyy-MM-dd', { locale: zhCN });
  } catch (error) {
    return dateString;
  }
};

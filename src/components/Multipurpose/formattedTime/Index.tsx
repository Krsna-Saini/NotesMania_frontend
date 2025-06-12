import { 
  differenceInYears, 
  differenceInMonths, 
  differenceInDays, 
  format 
} from 'date-fns';

const getTimeAgo = (date:Date) => {
  const now = new Date();
  const commentDate = new Date(date);

  const years = differenceInYears(now, commentDate);
  if (years > 0) return `${years} y${years > 1 ? 's' : ''} ago`;

  const months = differenceInMonths(now, commentDate);
  if (months > 0) return `${months} m${months > 1 ? 's' : ''} ago`;

  const days = differenceInDays(now, commentDate);
  if (days > 0) return `${days} d${days > 1 ? 's' : ''} ago`;

  // If it's within the same day, show the exact time in 24-hour format
  return format(commentDate, "HH:mm");
};

const Time = ({ commentDate , className }:{commentDate:Date,className?:string}) => {
  return <span className={className?className:'text-sm'}>{getTimeAgo(commentDate)}</span>;
};

export default Time;

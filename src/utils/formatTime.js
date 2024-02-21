import { format, formatDistanceToNow, parseISO } from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz'

// ----------------------------------------------------------------------

export function fDate(date) {
  return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date) {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date) {
  return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}

export function splitISODatetime(datetime){
  const date = format(datetime, 'yyyy-MM-dd');
  const time = format(utcToZonedTime(datetime, "UTC"), 'HH:mm:ss.SSS');
  return {date,time}
}

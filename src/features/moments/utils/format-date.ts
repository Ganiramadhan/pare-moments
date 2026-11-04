import { format, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'

export const formatDay = (date: string) =>
  format(parseISO(date), 'EEE, d MMM yyyy', { locale: enUS })

export const formatMonth = (date: string) => format(parseISO(date), 'MMMM yyyy', { locale: enUS })

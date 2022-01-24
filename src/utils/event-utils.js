import dayjs from 'dayjs';

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const createDateTemplate = (dateFrom, format) => dayjs(dateFrom).format(format);

const sortByDate = (events) => events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

const getEventDuration = (start, end) => dayjs(start).diff(dayjs(end));

const sortDateDown = (firstEvent, secondEvent) => firstEvent.dateFrom - secondEvent.dateFrom;

const sortDurationDown = (eventA, eventB) => getEventDuration(eventA.dateFrom, eventA.dateTo) - getEventDuration(eventB.dateFrom, eventB.dateTo);

const sortPriceDown = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const eventDurationFormat = (duration) => {
  const minutesDuration = duration % MINUTES_IN_HOUR > 0 ? `${duration % MINUTES_IN_HOUR}M` : '';
  const hoursDuration = Math.floor(duration / MINUTES_IN_HOUR) % HOURS_IN_DAY > 0 ? `${Math.floor(duration / MINUTES_IN_HOUR) % HOURS_IN_DAY}H ` : '';
  const daysDuration = Math.floor((duration / MINUTES_IN_HOUR) / HOURS_IN_DAY) > 0 ? `${Math.floor((duration / MINUTES_IN_HOUR) / HOURS_IN_DAY)}D ` : '';

  return daysDuration + hoursDuration + minutesDuration;
};

const isEscapeEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export { createDateTemplate, sortDateDown, sortDurationDown, sortPriceDown, eventDurationFormat, sortByDate, isEscapeEvent };

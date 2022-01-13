import dayjs from 'dayjs';

const createDateTemplate = (dateFrom, format) => dayjs(dateFrom).format(format);

const sortByDate = (events) => {
  const eventsByDay = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

  return eventsByDay;
};

const getEventDuration = (start, end) => dayjs(start).diff(dayjs(end));

const sortDateDown = (eventA, eventB) => eventA.dateFrom - eventB.dateFrom;

const sortDurationDown = (eventA, eventB) => getEventDuration(eventA.dateFrom, eventA.dateTo) - getEventDuration(eventB.dateFrom, eventB.dateTo);

const sortPriceDown = (eventA, eventB) => eventB.basePrice - eventA.basePrice;

const eventDurationFormat = (duration) => {
  const minutesDuration = duration % 60 > 0 ? `${duration % 60}M` : '';
  const hoursDuration = Math.floor(duration / 60) % 24 > 0 ? `${Math.floor(duration / 60) % 24}H ` : '';
  const daysDuration = Math.floor((duration / 60) / 24) > 0 ? `${Math.floor((duration / 60) / 24)}D ` : '';
  return daysDuration + hoursDuration + minutesDuration;
};

export { createDateTemplate, sortDateDown, sortDurationDown, sortPriceDown, eventDurationFormat, sortByDate };

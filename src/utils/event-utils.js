import dayjs from 'dayjs';

const isEventAfter = (date) => date && dayjs().isAfter(date, 'D');
const isEventBefore = (date) => date && dayjs().isBefore(date, 'D');

//ф-я фильтра в коммите 2.17 репозитория taskmanager
const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((event) => isEventAfter(event.dateFrom)).length,
  past: (events) => events.filter((event) => isEventBefore(event.dateTo)).length,
  // now: (events) => events.filter((event) => isEventBefore(event.dateFrom) && isEventAfter(event.dateTo)).length,
};

const generateFilter = (events) => Object.entries(eventToFilterMap).map(
  ([filterName, countEvents]) => ({
    name: filterName,
    count: countEvents(events),
  }),
);

const createDateTemplate = (dateFrom, format) => dayjs(dateFrom).format(format);

//2.17 tasckmanager
const sortByDate = (events) => {
  const eventsByDay = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

  return eventsByDay;
};

const sortByPrice = (events) => {
  const eventsByPrice = events.slice().sort((a, b) => a.basePrice - b.basePrice);

  return eventsByPrice;
};

export { isEventAfter, isEventBefore, createDateTemplate, sortByDate, sortByPrice, generateFilter };

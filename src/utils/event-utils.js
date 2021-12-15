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
// const sortByDate = (events) => {
//   const eventsByDay = events.slice().sort((a, b) => a.dateFrom - b.dateFrom);

//   return eventsByDay;
// };

const getEventDuration = (start, end) => dayjs(start).diff(dayjs(end));

const sortDateDown = (eventA, eventB) => eventA.dateFrom - eventB.dateFrom;

const sortDurationDown = (eventA, eventB) => getEventDuration(eventA.dateFrom, eventA.dateTo) - getEventDuration(eventB.dateFrom, eventB.dateTo);

const sortPriceDown = (eventA, eventB) => eventB.basePrice - eventA.basePrice;


export { isEventAfter, isEventBefore, createDateTemplate, generateFilter, sortDateDown, sortDurationDown, sortPriceDown };

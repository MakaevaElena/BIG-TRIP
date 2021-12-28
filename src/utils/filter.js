import { FilterType } from '../const.js';
// import dayjs from 'dayjs';

const isFutureEvent = (event) => {
  const { dateFrom } = event;
  const currentDate = new Date();
  return currentDate - dateFrom < 0;
};
const isPastEvent = (event) => {
  const { dateTo } = event;
  const currentDate = new Date();
  return currentDate - dateTo > 0;
};

const filter = {
  [FilterType.ALL]: (events) => events.filter((event) => event),
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureEvent(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastEvent(event)),
};

// const isEventAfter = (date) => date && dayjs().isAfter(date, 'D');
// const isEventBefore = (date) => date && dayjs().isBefore(date, 'D');

// //ф-я фильтра в коммите 2.17 репозитория taskmanager
// const eventToFilterMap = {
//   everything: (events) => events.length,
//   future: (events) => events.filter((event) => isEventAfter(event.dateFrom)).length,
//   past: (events) => events.filter((event) => isEventBefore(event.dateTo)).length,
// };

// const generateFilter = (events) => Object.entries(eventToFilterMap).map(
//   ([filterName, countEvents]) => ({
//     name: filterName,
//     count: countEvents(events),
//   }),
// );


export { filter };

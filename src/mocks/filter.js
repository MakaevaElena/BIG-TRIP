import { isEventAfter, isEventBefore } from '../utils.js';

//ф-я фильтра в коммите 2.17 репозитория taskmanager
const eventToFilterMap = {
  everything: (events) => events.length,
  future: (events) => events.filter((event) => isEventAfter(event.dateFrom)).length,
  past: (events) => events.filter((event) => isEventBefore(event.dateTo)).length,
  // now: (events) => events.filter((event) => isEventBefore(event.dateFrom) && isEventAfter(event.dateTo)).length,
};

export const generateFilter = (events) => Object.entries(eventToFilterMap).map(
  ([filterName, countEvents]) => ({
    name: filterName,
    count: countEvents(events),
  }),
);

